// Copyright (c) The Linux Foundation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const crypto = require('crypto')
const requestPromise = require('request-promise-native')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const express = require('express')
const router = express.Router()
const utils = require('../lib/utils')
const config = require('../lib/config')
const BadgeCalculator = require('../business/badgeCalculator')

async function getComponentBadgeRouterShell(definitionService, request) {
  const badge = await getComponentBadgeLink(definitionService, request)
  return badge
}

async function getComponentBadgeLink(definitionService, request) {
  const coordinates = utils.toEntityCoordinatesFromRequest(request)
  const definition = await definitionService.get(coordinates, request.params.pr)
  const url = badgeService.getBadgeUrl(definition)
  const badgeCacheKey = await getCacheKey('clearlyDefined.badge', url)
  const badge = await getBadge(badgeCacheKey, request, url)
  return badge
}

async function getBadge(badgeCacheKey, request, url) {
  let badge = await request.app.locals.cache.get(badgeCacheKey)
  if (!badge) {
    const badgePromise = await getShieldBadge(url)
      .then(async response => {
        await request.app.locals.cache.set(badgeCacheKey, response, config.auth.github.timeouts.info)
        badge = response
      })
      .catch(err => {
        console.log(err)
      })
  }
  return badge
}

async function getShieldBadge(url) {
  return requestPromise({
    url: `${url}`,
    method: 'GET',
    headers: {},
    json: false
  })
}

async function getCacheKey(prefix, token) {
  const hashedToken = await crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
  return `${prefix}.${hashedToken}`
}

router.get(
  '/:type/:provider/:namespace/:name/:revision',
  asyncMiddleware(async (request, response) => {
    return getComponentBadgeRouterShell(definitionService, request).then(result => {
      response.status(200).send({ svgTag: result })
    })
  })
)

let badgeService
let definitionService

function setup(service, defService) {
  badgeService = service
  definitionService = defService
  return router
}

module.exports = setup
