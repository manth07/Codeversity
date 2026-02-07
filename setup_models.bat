@echo off
title Astra Learn - Model Setup
color 0A

echo ===================================================
echo      Astra Learn - Model Setup Script
echo ===================================================
echo.
echo This script will download the required AI models for Astra Learn.
echo These models will be stored in your local Ollama registry.
echo.
echo [1/3] Pulling Tutor Model (deepseek-r1:8b)...
echo ---------------------------------------------------
call ollama pull deepseek-r1:8b

echo.
echo [2/3] Pulling Council Model (phi4)...
echo ---------------------------------------------------
call ollama pull phi4

echo.
echo [3/3] Pulling Fallback Model (llama3)...
echo ---------------------------------------------------
call ollama pull llama3

echo.
echo ===================================================
echo      All Models Installed Successfully!
echo ===================================================
echo.
echo You can now run the application with: npm run dev
echo.
pause
