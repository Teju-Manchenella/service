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

  getBadgeUrl(definition) {
    return scoreToUrl[this.calculate(definition)]
  }

  calculate(definition) {
    const hasLicense = get(definition, 'licensed.declared')
    const hasAttributionParties = get(definition, 'licensed.attribution.parties[0]')
    if (hasLicense && hasAttributionParties) return 2
    if (hasLicense || hasAttributionParties) return 1
    return 0
  }
}

module.exports = () => new BadgeService()
