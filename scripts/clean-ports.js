#!/usr/bin/env node

/**
 * Script para limpar processos Node.js anteriores
 * Executa automaticamente antes de iniciar o servidor de desenvolvimento
 */

const { exec } = require("child_process");
const os = require("os");
const path = require("path");

function killNodeProcesses() {
  return new Promise((resolve, reject) => {
    if (os.platform() === "win32") {
      // Windows
      exec(
        'wmic process where name="node.exe" delete /nointeractive',
        (err, stdout, stderr) => {
          if (err && !err.message.includes("No Instance(s) Available")) {
            console.warn("⚠️  Aviso ao limpar processos:", err.message);
          } else {
            console.log("✅ Processos Node.js antigos removidos");
          }
          resolve();
        }
      );
    } else {
      // macOS e Linux
      exec('pkill -f "node" || true', (err) => {
        if (err && err.code !== 1) {
          console.warn("⚠️  Aviso ao limpar processos:", err.message);
        } else {
          console.log("✅ Processos Node.js antigos removidos");
        }
        resolve();
      });
    }
  });
}

function killPortProcess(port) {
  return new Promise((resolve) => {
    if (os.platform() === "win32") {
      // Windows - mata processo na porta específica
      exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (stdout) {
          const pid = stdout.trim().split(/\s+/).pop();
          if (pid && pid !== "PID") {
            exec(`taskkill /PID ${pid} /F`, (killErr) => {
              if (!killErr) {
                console.log(`✅ Processo na porta ${port} removido`);
              }
              resolve();
            });
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    } else {
      // macOS e Linux
      exec(`lsof -ti :${port} | xargs kill -9 2>/dev/null || true`, () => {
        console.log(`✅ Processo na porta ${port} removido`);
        resolve();
      });
    }
  });
}

async function main() {
  console.log("🧹 Limpando portas e processos antigos...\n");

  // Mata processo específico na porta 3000
  await killPortProcess(3000);

  // Aguarda um pouco antes de retornar
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("\n✨ Pronto para iniciar o servidor!\n");
}

main().catch(console.error);
