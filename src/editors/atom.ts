import os from "os";
import fs from "async-file";
import path from "path";
import { CommandExists } from "../lib/command-exists";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

export default class Atom implements Editor {
  private commandExists = new CommandExists();

  public get name(): string {
    return "atom";
  }

  public get displayName(): string {
    return "Atom";
  }

  public get icon(): string {
    return "";
  }

  public async isEditorInstalled(): Promise<boolean> {
    try {
      // @ts-ignore
      return await this.commandExists.exists(this.name);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async isPluginInstalled(): Promise<boolean> {
    if (await this.isDirectory(path.join(this.pluginsDirectory(), "wakatime")))
      return true;

    try {
      return await this.apm();
    } catch (err) {
      console.error(err);
      return false;
    }
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

  public pluginsDirectory(): string {
    switch (os.platform()) {
      case "win32": {
        const is64bit: string | boolean =
          process.arch === "x64" || process.env.PROCESSOR_ARCHITEW6432;
        if (is64bit) {
          return "";
        }
        return "";
      }
      case "darwin":
        return path.join(os.homedir(), ".atom/packages");
      case "linux":
        return "";
      default:
        return null;
    }
  }

  public async apm(): Promise<boolean> {
    const { stdout, stderr } = await exec("apm list -p -i -j");
    if (stderr) return Promise.reject(new Error(stderr));

    const json = JSON.parse(stdout);
    const obj = json.user.find(n => n.name === "wakatime");
    return Promise.resolve(obj !== undefined);
  }
}
