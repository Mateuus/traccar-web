@echo off
cd E:\Aplicativo\Traccar Server\traccar-rdmweb\web
set SDK=E:\Aplicativo\sencha\ext-6.2.0

sencha -sdk %SDK% compile -classpath=app.js,app,%SDK%\packages\core\src,%SDK%\packages\core\overrides,%SDK%\classic\classic\src,%SDK%\classic\classic\overrides exclude -all and include -recursive -file app.js and exclude -namespace=Ext and concatenate -closure app.min.js
