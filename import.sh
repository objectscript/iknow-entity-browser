#!/usr/bin/env bash
# This batch script makes the Caché application deployment much faster by building and importing the project.
# Replace the variables below to match your Caché installation and build & import application to Caché using only one command.
# Caché 2016.2+ IS REQUIRED TO PROCEED

# Configurable variables: change them to fit your system #
CACHE_DIR="C:\Program Files\InterSystems\Ensemble"
NAMESPACE=DCANALYTICS
USERNAME=_SYSTEM
PASSWORD=SYS
##########################################################

set +v
# Pre-configured variables
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR=docs/cls
XML_EXPORT_DIR=docs
PACKAGE_NAME=EntityBrowser

# Build and import application to Caché
echo "Importing project..."
npm run gulp
cat <<EOT | "$CACHE_DIR/bin/cache" -s "$CACHE_DIR/mgr" -U ${NAMESPACE}
${USERNAME}
${PASSWORD}
zn "${NAMESPACE}" set st = \$system.Status.GetErrorText(\$system.OBJ.ImportDir("${DIR}/${BUILD_DIR}",,"ck /checkuptodate=all",,1))
write "IMPORT STATUS: "_\$case(st="",1:"OK",:st), \!
s st = \$system.Status.GetErrorText(\$system.OBJ.ExportPackage("${PACKAGE_NAME}", "${DIR}/${XML_EXPORT_DIR}/${PACKAGE_NAME}%-v"_##class(${PACKAGE_NAME}.Installer).#VERSION_".xml")) w \$c(13,10)_"EXPORT STATUS: "_\$case(st="",1:"OK",:st), \! halt
EOT
