for f in `ls -1 *.md`
do
 nf=`echo ${f} | sed 's/md/html/'`
 mv $f $nf
done
