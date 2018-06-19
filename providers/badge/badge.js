// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const { get } = require('lodash')

const scoreToUrl = {
  0: 'https://img.shields.io/badge/ClearlyDefined-0-red.svg',
  1: 'https://img.shields.io/badge/ClearlyDefined-1-yellow.svg',
  2: 'https://img.shields.io/badge/ClearlyDefined-2-brightgreen.svg'
}

class BadgeService {
  constructor() {}

  getBadgeUrl(score) {
    return scoreToUrl[score]
  }
}

module.exports = () => new BadgeService()
