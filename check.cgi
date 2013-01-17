#!/usr/local/bin/ruby
# 漢字
#
# $Date: 2008-11-16 11:01:57 +0900 (日, 16 11月 2008) $
# $Rev: 3089 $
#

require 'cgi'
require 'sdbm'

cgi = CGI.new('html3')

id = cgi.params['id'][0]
sequence = cgi.params['sequence'][0]

seqdbm = SDBM.open('sequence',0666)
strdbm = SDBM.open('string',0666)

result = ''
if sequence == seqdbm[id] then
  result = strdbm[id].to_s
end

jsonp = 'result("'+CGI.escape(result)+'");'
# jsonp = 'result("'+result+'");'
cgi.out { jsonp }

# cgi.out { result }

