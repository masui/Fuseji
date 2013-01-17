#!/usr/local/bin/ruby
# 漢字
#
# $Date: 2008-11-16 11:02:15 +0900 (日, 16 11月 2008) $
# $Rev: 3090 $
#

require 'cgi'
require 'sdbm'

cgi = CGI.new('html3')

id = cgi.params['id'][0]
sequence = cgi.params['sequence'][0]
string = cgi.params['string'][0].gsub(/</,'&lt;') # sanitize

seqdbm = SDBM.open('sequence',0666)
strdbm = SDBM.open('string',0666)

seqdbm[id] = sequence
strdbm[id] = string

#File.open("/tmp/logfile","w"){ |f|
#  f.puts sequence
#  f.puts string
#  f.puts id
#}

cgi.out { id }




