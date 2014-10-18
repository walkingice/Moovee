# -*- coding: utf-8 -*-
#
# Copyright 2012, John Lee <john@0xlab.org>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import csv
import sys
import urllib

from BeautifulSoup import BeautifulSoup


def screenscrap(url, writer):
    remark_mapping = {u'影人出席': '★', u'影片拷貝非英語發音且無英文字幕': '▲', u'已售完': '◎'}
    # prepare page mapping
    pm = {}
    f = open('pagelink.txt', 'rU')
    with f:
        reader = csv.reader(f, dialect='excel-tab')
        for row in reader:
            # map movie -> page
            pm[row[1]] = row[0]
    cm = {}
    f = open('categories.txt', 'rU')
    with f:
        reader = csv.reader(f, dialect='excel-tab')
        for row in reader:
            # map movie -> category
            cm[row[0]] = row[1]
    f = urllib.urlopen(url)
    bs = BeautifulSoup(f)
    rows = bs.body.find('div', id='main').find('table').tr.findNextSiblings(True)
    f = urllib.urlopen(url + '&lang=en&switch_lang=1')
    bs = BeautifulSoup(f)
    eng_rows = bs.body.find('div', id='main').find('table').tr.findNextSiblings(True)
    for row in rows:
        eng_row = eng_rows.pop(0)
        try:
            # 0-date, 1-place, 2-time, 3-ctitle, 4-duration, 5-grade, 6-remark, 7-login
            cols = row.findAll('td')
            remark = ''
            span = cols[6].span
            while span:
                if span.span:
                    remark += remark_mapping[span['title']]
                span = span.findNextSibling('span')
            duration = cols[4].string.replace(u'分', '')
            if not cols[3].a:
                continue
            ctitle = cols[3].a.string.encode('utf-8')
            etitle = eng_row.findAll('td')[3].a.string
            page = pm.get(ctitle)
            if not page:
                raise Exception('page missing: %s' % ctitle)
            category = cm[ctitle]
            if not category:
                raise Exception('category missing: %s' % ctitle)
            link = ''
        except:
            print >> sys.stderr, 'url: %s\nrow: %s' % (url, row)
            import traceback
            traceback.print_exc()
            sys.exit()
        writer.writerow([
                cols[1].string, cols[0].string, cols[2].string, duration, category,
                ctitle, etitle, cols[5].span.string, remark, page,
#                link,
                ])


def main():
    urls = ['http://www.goldenhorse.org.tw/ui/index.php?class=ghff&func=schedule&subwork=date&search_date=2013-11-%02d' \
               % d for d in xrange(8, 29)]
    writer = csv.writer(sys.stdout, dialect='excel-tab')
    writer.writerow(['PLACE', 'DATE', 'TIME', 'DURATION', 'CATEGORY', 'CTITLE',
                     'ETITLE', 'GRADE', 'REMARK', 'PAGE',
#                     'LINK',
                     ])
    for url in urls:
        screenscrap(url, writer)


if __name__ == '__main__':
    main()
