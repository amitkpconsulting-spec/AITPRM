@echo off
REM ====================================================================
REM  AITPRM PLATFORM - WINDOWS PORTABLE LAUNCHER
REM ====================================================================
REM  Launches local web application, verifies Ollama local sidecar service,
REM  and opens default web browser on http://localhost:3000.
REM ====================================================================

title AITPRM Tool - Platform Server
color 0B

echo.
echo ====================================================================
echo   AITPRM PLATFORM - LAUNCHING LOCAL ENGINE
echo ====================================================================
echo [INFO] Environment: Windows x64
echo [INFO] URL Target: http://localhost:3000
echo ====================================================================
echo.

REM 1. PORTABLE PATH CHECK
if exist ".\bin\node\node.exe" (
    set "PATH=%CD%\bin\node;%PATH%"
)

REM 2. CHECK OLLAMA LOCAL SIDECAR SERVICE
echo [1/3] Checking Ollama local AI sidecar listener (port 11434)...
netstat -o -n -a | findstr "11434" >nul 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Local Ollama LLM sidecar active on port 11434.
) else (
    where ollama >nul 2>nul
    if %errorlevel% equ 0 (
        echo [INFO] Starting local Ollama LLM sidecar service...
        start /b ollama serve >nul 2>&1
        timeout /t 2 >nul
    ) else (
        echo [INFO] Running in self-contained browser WASM / Transformers.js execution mode.
    )
)

echo.

REM 3. LAUNCH WEB BROWSER AUTOMATICALLY
echo [2/3] Launching default web browser at http://localhost:3000...
timeout /t 2 >nul
start http://localhost:3000

echo.

REM 4. START LOCAL APPLICATION SERVER
echo [3/3] Starting Portable Application Server on port 3000...
echo ====================================================================
echo [PRESS CTRL+C TO STOP SERVER]
echo ====================================================================
echo.

call npm run dev

pause
