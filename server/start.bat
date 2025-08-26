@echo off
title PocketBase Server
echo ====================================
echo    Starting PocketBase Server
echo ====================================
echo.
echo Admin UI: http://localhost:8090/_/
echo API: http://localhost:8090/api/
echo.
echo Press Ctrl+C to stop the server
echo ====================================
echo.
pocketbase.exe serve
pause