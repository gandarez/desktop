import os from "os";
import fs from "async-file";
import path from "path";
import "./editor";

export default class SublimeText3 implements Editor {
  public get name(): string {
    return "subl";
  }

  public get displayName(): string {
    return "Sublime Text 3";
  }

  public get icon(): string {
    return "";
  }

  public async isEditorInstalled(): Promise<boolean> {
    return await this.isDirectory(this.appDirectory());
  }

  public async isPluginInstalled(): Promise<boolean> {
    const val = await this.isDirectory(
      path.join(this.pluginsDirectory(), "WakaTime")
    );
    return val;
  }

  public async installPlugin(): Promise<void> {
    return Promise.reject(new Error("method not implemented"));
  }

  public async uninstallPlugin(): Promise<void> {
    return Promise.reject(new Error("method not implemented"));
  }

  public async isDirectory(directory: string): Promise<boolean> {
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  }

  private appDirectory(): string {
    let dir: string;
    switch (os.platform()) {
      case "win32":
        return "";
      case "darwin":
        return "/Applications/Sublime Text.app/Contents";
      default:
        return null;
    }
  }

  private pluginsDirectory(): string {
    switch (os.platform()) {
      case "win32": {
        const is64bit =
          process.arch === "x64" || process.env.PROCESSOR_ARCHITEW6432;
        if (is64bit) return "";
        return "";
      }
      case "darwin":
        return path.join(
          os.homedir(),
          "Library/Application Support/Sublime Text 3/Packages"
        );
      case "linux":
        return "";
      default:
        return null;
    }
  }
}
