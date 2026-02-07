#!/bin/bash

# Astra Learn Model Setup Script

echo -e "\033[0;32m===================================================\033[0m"
echo -e "\033[1;37m     Astra Learn - Model Setup Script\033[0m"
echo -e "\033[0;32m===================================================\033[0m"
echo ""
echo "This script will download the required AI models for Astra Learn."
echo "These models will be stored in your local Ollama registry."
echo ""

echo -e "\033[0;34m[1/3] Pulling Tutor Model (deepseek-r1:8b)...\033[0m"
echo "---------------------------------------------------"
ollama pull deepseek-r1:8b

echo ""
echo -e "\033[0;34m[2/3] Pulling Council Model (phi4)...\033[0m"
echo "---------------------------------------------------"
ollama pull phi4

echo ""
echo -e "\033[0;34m[3/3] Pulling Fallback Model (llama3)...\033[0m"
echo "---------------------------------------------------"
ollama pull llama3

echo ""
echo -e "\033[0;32m===================================================\033[0m"
echo -e "\033[1;37m     All Models Installed Successfully!\033[0m"
echo -e "\033[0;32m===================================================\033[0m"
echo ""
echo "You can now run the application with: npm run dev"
echo ""
