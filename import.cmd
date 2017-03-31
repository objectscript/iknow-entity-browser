:: This batch script makes the Caché application deployment much faster by building and importing the project.
:: Replace the variables below to match your Caché installation and build & import application to Caché using only one command.
:: Caché 2016.2+ IS REQUIRED TO PROCEED

:: Configurable variables: change them to fit your system ::
set CACHE_DIR=C:\Program Files\InterSystems\Ensemble
set NAMESPACE=SAMPLES
set USERNAME=_SYSTEM
set PASSWORD=SYS
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

@echo off
:: Pre-configured variables
set BUILD_DIR=build\cls
set XML_EXPORT_DIR=build
set PACKAGE_NAME=EntityBrowser

:: Build and import application to Caché
echo Importing project...
call npm run gulp
(
echo %USERNAME%
echo %PASSWORD%
echo zn "%NAMESPACE%" set st = $system.Status.GetErrorText($system.OBJ.ImportDir("%~dp0%BUILD_DIR%",,"ck",,1^^^)^^^) w "IMPORT STATUS: "_$case(st="",1:"OK",:st^^^), !
echo s st = $system.Status.GetErrorText($system.OBJ.ExportPackage("%PACKAGE_NAME%", "%~dp0%XML_EXPORT_DIR%\%PACKAGE_NAME%-v"_##class(%PACKAGE_NAME%.Installer^^^).#VERSION_".xml"^^^)^^^) w $c(13,10^^^)_"EXPORT STATUS: "_$case(st="",1:"OK",:st^^^), ! halt
) | "%CACHE_DIR%\bin\cache.exe" -s "%CACHE_DIR%\mgr" -U %NAMESPACE%

:: Other utilities that may be useful:
::
:: Copy files to CSP folder
::$ set BUILD_STATIC_DIR=build\static
::$ set CSP_DIR=C:\Program Files\InterSystems\Ensemble\CSP\samples\EntityBrowser
::$ call xcopy /sy "%~dp0\%BUILD_STATIC_DIR%" "%CSP_DIR%"