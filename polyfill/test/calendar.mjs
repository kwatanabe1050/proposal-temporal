#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { Calendar } = Temporal;

describe('Calendar', () => {
  const iso = Calendar.from('iso8601');
  describe('Calendar.from()', () => {
    describe('from identifier', () => {
      // 402
      test('gregory');
      test('japanese');
      function test(id) {
        const calendar = Calendar.from(id);
        it(`Calendar.from(${id}) is a calendar`, () => assert(calendar instanceof Calendar));
        it(`Calendar.from(${id}) has the correct ID`, () => equal(calendar.id, id));
      }
    });
    describe('Calendar.from(ISO string)', () => {
      test('1994-11-05T08:15:30-05:00[u-ca=gregory]', 'gregory');
      test('1994-11-05T13:15:30Z[u-ca=japanese]', 'japanese');
      function test(isoString, id) {
        const calendar = Calendar.from(isoString);
        it(`Calendar.from(${isoString}) is a calendar`, () => assert(calendar instanceof Calendar));
        it(`Calendar.from(${isoString}) has ID ${id}`, () => equal(calendar.id, id));
      }
    });
  });
  describe('Calendar.dateUntil()', () => {
    const date1 = Temporal.PlainDate.from('1999-09-03');
    const date2 = Temporal.PlainDate.from('2000-01-01');
    it('casts first argument', () => {
      equal(`${iso.dateUntil(Temporal.PlainDateTime.from('1999-09-03T08:15:30'), date2, {})}`, 'P120D');
      equal(`${iso.dateUntil({ year: 1999, month: 9, day: 3 }, date2, {})}`, 'P120D');
      equal(`${iso.dateUntil('1999-09-03', date2, {})}`, 'P120D');
    });
    it('casts second argument', () => {
      equal(`${iso.dateUntil(date1, Temporal.PlainDateTime.from('2000-01-01T08:15:30'), {})}`, 'P120D');
      equal(`${iso.dateUntil(date1, { year: 2000, month: 1, day: 1 }, {})}`, 'P120D');
      equal(`${iso.dateUntil(date1, '2000-01-01', {})}`, 'P120D');
    });
    it('objects must contain at least the required properties', () => {
      throws(() => iso.dateUntil({ month: 11 }, date2, {}), TypeError);
      throws(() => iso.dateUntil(date1, { month: 11 }, {}), TypeError);
    });
  });
});
describe('Built-in calendars (not standardized yet)', () => {
  describe('gregory', () => {
    it('era CE', () => {
      const date = Temporal.PlainDate.from('1999-12-31[u-ca=gregory]');
      equal(date.era, 'ce');
      equal(date.eraYear, 1999);
      equal(date.year, 1999);
    });
    it('era BCE', () => {
      const date = Temporal.PlainDate.from('-000001-12-31[u-ca=gregory]');
      equal(date.era, 'bce');
      equal(date.eraYear, 2);
      equal(date.year, -1);
    });
    it('can create from fields with era CE', () => {
      const date = Temporal.PlainDate.from({ era: 'ce', eraYear: 1999, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '1999-12-31[u-ca=gregory]');
    });
    it('era CE is the default', () => {
      const date = Temporal.PlainDate.from({ year: 1999, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '1999-12-31[u-ca=gregory]');
    });
    it('can create from fields with era BCE', () => {
      const date = Temporal.PlainDate.from({ era: 'bce', eraYear: 2, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '-000001-12-31[u-ca=gregory]');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
