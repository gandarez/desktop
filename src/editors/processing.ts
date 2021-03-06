import { Extract } from "unzipper";
import os from "os";
import fs from "async-file";
import fsSync from "fs";
import path from "path";
import request from "request";

export default class Processing implements Editor {
  private preferences: { [key: string]: string } = {};

  constructor() {
    this.readPreferences();
  }

  public get name(): string {
    return "processing";
  }

  public get displayName(): string {
    return "Processing";
  }

  public get icon(): string {
    return "";
  }

  public async isEditorInstalled(): Promise<boolean> {
    if (await this.isDirectory(this.appDirectory())) return true;

    return await this.isDirectory(this.getSketchbookPathThree());
  }

  public async isPluginInstalled(): Promise<boolean> {
    return await this.isDirectory(
      path.join(this.pluginsDirectory(), "WakatimeTool")
    );
  }

  public async installPlugin(): Promise<void> {
    const temp = path.join(os.tmpdir(), "processing-wakatime-deploy.zip");
    console.log(temp);
    const file = fsSync.createWriteStream(temp);

    await new Promise((resolve, reject) => {
      request({
        uri:
          "https://github.com/devgianlu/processing-wakatime/releases/latest/download/processing-wakatime-deploy.zip",
        gzip: true
      })
        .pipe(file)
        .on("finish", async () => {
          const pluginsDirectory = this.pluginsDirectory();
          const stream2 = await fs.createReadStream(temp);
          await stream2.pipe(Extract({ path: pluginsDirectory }));
          fs.delete(temp);
          resolve();
        })
        .on("error", (err: any) => {
          console.error(err);
          reject(err);
        });
    }).catch(err => {
      console.error(err);
    });
  }

  public async uninstallPlugin(): Promise<void> {
    const pluginPath = path.join(this.pluginsDirectory(), "WakatimeTool");
    await fs.delete(pluginPath);
    return Promise.resolve();
  }

  public async isDirectory(directory: string): Promise<boolean> {
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  }

  private appDirectory(): string {
    switch (os.platform()) {
      case "win32":
        return "";
      case "darwin":
        return "/Applications/Processing.app/Contents";
      default:
        return null;
    }
  }

  private readPreferences(): void {
    switch (os.platform()) {
      case "win32":
        break;
      case "darwin": {
        const file = path.join(
          os.homedir(),
          "Library/Processing/preferences.txt"
        );
        if (fsSync.existsSync(file)) {
          const data = fsSync.readFileSync(file, { encoding: "utf8" });
          if (data) {
            data.split(/\r?\n/).forEach(line => {
              const split = line.split("=");
              this.preferences[split[0]] = split[1];
            });
          }
        }
        break;
      }
      default:
        break;
    }
  }

  private getSketchbookPathThree(): string {
    switch (os.platform()) {
      case "win32":
        return "";
      case "darwin": {
        const defaultDirectory = path.join(
          os.homedir(),
          "Documents/Processing"
        );
        return this.preferences.hasOwnProperty("sketchbook.path.three")
          ? this.preferences["sketchbook.path.three"]
          : defaultDirectory;
      }
      default:
        return null;
    }
  }

  private pluginsDirectory(): string {
    switch (os.platform()) {
      case "win32": {
        const is64bit =
          process.arch === "x64" || process.env.PROCESSOR_ARCHITEW6432;
        if (is64bit) {
          return "";
        }
        return "";
      }
      case "darwin":
        return path.join(this.getSketchbookPathThree(), "tools");
      case "linux":
        return "";
      default:
        return null;
    }
  }
}
