import fs from "node:fs/promises";
import path from "node:path";
import type { BotLanguage } from "@prisma/client";

type Analysis = { language: BotLanguage; entrypoint?: string; installCommand?: string; startCommand?: string; dockerfilePath?: string; confidence: number; detectedFiles: string[] };

async function exists(file: string) { try { await fs.access(file); return true; } catch { return false; } }

export async function analyzeProject(dir: string): Promise<Analysis> {
  const files = await fs.readdir(dir, { recursive: true }).then(xs => xs.map(String).slice(0, 5000));
  const has = (f: string) => files.includes(f) || files.some(x => x.endsWith(`/${f}`));
  if (has("Dockerfile")) return { language: "UNKNOWN", dockerfilePath: "Dockerfile", confidence: 0.92, detectedFiles: files };
  if (has("package.json")) {
    const pkgPath = path.join(dir, "package.json");
    let startCommand = "npm start";
    if (await exists(pkgPath)) {
      const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
      if (pkg.scripts?.start) startCommand = "npm run start";
      else if (pkg.scripts?.dev) startCommand = "npm run dev";
    }
    return { language: "NODEJS", entrypoint: has("index.js") ? "index.js" : has("src/index.js") ? "src/index.js" : undefined, installCommand: "npm ci || npm install", startCommand, confidence: .95, detectedFiles: files };
  }
  if (has("requirements.txt") || has("pyproject.toml")) return { language: "PYTHON", entrypoint: has("bot.py") ? "bot.py" : has("main.py") ? "main.py" : undefined, installCommand: "pip install -r requirements.txt", startCommand: has("bot.py") ? "python bot.py" : "python main.py", confidence: .93, detectedFiles: files };
  if (has("Cargo.toml")) return { language: "RUST", installCommand: "cargo build --release", startCommand: "./target/release/app", confidence: .9, detectedFiles: files };
  if (has("go.mod")) return { language: "GO", installCommand: "go mod download && go build -o app .", startCommand: "./app", confidence: .9, detectedFiles: files };
  if (has("pom.xml") || has("build.gradle")) return { language: "JAVA", installCommand: "mvn package -DskipTests", startCommand: "java -jar target/*.jar", confidence: .87, detectedFiles: files };
  if (has("composer.json")) return { language: "PHP", installCommand: "composer install --no-dev", startCommand: "php index.php", confidence: .84, detectedFiles: files };
  if (has("*.csproj") || files.some(f => f.endsWith(".csproj"))) return { language: "DOTNET", installCommand: "dotnet restore && dotnet publish -c Release -o out", startCommand: "dotnet out/*.dll", confidence: .84, detectedFiles: files };
  return { language: "UNKNOWN", confidence: .2, detectedFiles: files };
}
