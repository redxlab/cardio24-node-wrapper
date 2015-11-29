#!/bin/sh
# script for execution of deployed applications
#
# Sets up the MCR environment for the current $ARCH and executes
# the specified command.
# arg1 = matlab runtime
# arg2 = input filename
# arg3 = sampling frequency
#
exe_name=$0

#read output file generated from matlab and echo its contents
filepath="$2"
curdir=`dirname "$filepath"`
filename=`basename "$filepath"`
opfilename=$(echo -n $filename | head -c -4)_op.txt

exe_dir=`dirname "$0"`
#echo "------------------------------------------"
if [ "x$1" = "x" ]; then
  echo Usage:
  echo    $0 \<deployedMCRroot\> args
else
#  echo Setting up environment variables
  MCRROOT="$1"
#  echo ---
  LD_LIBRARY_PATH=.:${MCRROOT}/runtime/glnxa64 ;
  LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${MCRROOT}/bin/glnxa64 ;
  LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${MCRROOT}/sys/os/glnxa64;
	MCRJRE=${MCRROOT}/sys/java/jre/glnxa64/jre/lib/amd64 ;
	LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${MCRJRE}/native_threads ;
	LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${MCRJRE}/server ;
	LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${MCRJRE}/client ;
	LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${MCRJRE} ;
  XAPPLRESDIR=${MCRROOT}/X11/app-defaults ;
  export LD_LIBRARY_PATH;
  export XAPPLRESDIR;
#  echo LD_LIBRARY_PATH is ${LD_LIBRARY_PATH};
  shift 1
  args=
  while [ $# -gt 0 ]; do
      token=`echo "$1" | sed 's/ /\\\\ /g'`   # Add blackslash before each blank
      args="${args} ${token}"
      shift
  done
  "${exe_dir}"/afib_cardio24 $args
fi

#read output file generated from matlab and echo its contents
#echo $opfilename
#cat ${filename::-4}_op.txt
echo "::startoutput::"
#cat 3608de7d3f6e4b824ee01c284d108e4f_op.txt
cat $curdir"/../"$opfilename
#echo "hello"
echo "::endoutput::"
exit
