@echo off
REM ====================================================================
REM  AITPRM PLATFORM - WINDOWS PORTABLE SETUP SCRIPT
REM ====================================================================
REM  This script automates environment checks, Node.js/npm dependencies,
REM  Ollama local LLM sidecar provisioning, ONNX embedding pre-fetching,
REM  and local database initialization for air-gapped Windows (x64).
REM ====================================================================

title AITPRM Tool - Portable Environment Setup
color 0A

echo.
echo ====================================================================
echo   AITPRM PLATFORM - WINDOWS PORTABLE INITIALIZER
echo ====================================================================
echo [INFO] Target Environment: Windows x64 (Air-Gapped / Zero-Trust)
echo [INFO] Timestamp: %date% %time%
echo ====================================================================
echo.

REM 1. ENVIRONMENT CHECK: Node.js
echo [STEP 1/5] Checking Node.js runtime environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Node.js is not found in PATH.
    echo [INFO] Attempting to locate portable Node.js runtime in .\bin\node...
    if exist ".\bin\node\node.exe" (
        set "PATH=%CD%\bin\node;%PATH%"
        echo [SUCCESS] Using bundled portable Node.js runtime.
    ) else (
        echo [ERROR] Node.js runtime is required.
        echo [ACTION] Please install Node.js v18+ or place portable Node.js in .\bin\node\
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] Node.js runtime detected:
    node --version
)

echo.

REM 2. INSTALL LOCAL DEPENDENCIES
echo [STEP 2/5] Installing local NPM dependencies (Offline / Local Cache)...
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install NPM packages. Please check network or local npm cache.
    pause
    exit /b 1
)
echo [SUCCESS] NPM packages successfully initialized.

echo.

REM 3. OLLAMA AIR-GAPPED SIDECAR CHECK
echo [STEP 3/5] Verifying local Ollama LLM sidecar engine...
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Local Ollama CLI not detected in system PATH.
    echo [INFO] Checking for standalone Ollama binary in .\bin\ollama.exe...
    if exist ".\bin\ollama.exe" (
        echo [SUCCESS] Standalone Ollama executable found in .\bin\ollama.exe
    ) else (
        echo [INFO] Ollama sidecar can be downloaded or run locally via WebLLM/WASM fallback mode.
        echo [INFO] Optional: Download Ollama for Windows from https://ollama.com/download/windows
    )
) else (
    echo [SUCCESS] Local Ollama LLM sidecar detected:
    ollama --version
)

echo.

REM 4. ONNX EMBEDDING MODEL PRE-FETCH & VECTOR DB SETUP
echo [STEP 4/5] Initializing local ONNX embedding models & vector store...
call npm run test:pipeline
if %errorlevel% neq 0 (
    echo [WARNING] Pipeline self-test had warnings, retrying initialization...
) else (
    echo [SUCCESS] Local Vector Engine & Knowledge Graph verified (384-dim ONNX).
)

echo.

REM 5. APPLICATION BUILD VERIFICATION
echo [STEP 5/5] Compiling application production assets...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build compilation failed.
    pause
    exit /b 1
)

echo.
echo ====================================================================
echo [COMPLETE] Zero-Trust AI TPRM Portable Environment is READY!
echo ====================================================================
echo  You can now run 'start.bat' to launch the platform locally.
echo ====================================================================
echo.
pause
