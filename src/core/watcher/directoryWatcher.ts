export class DirectoryWatcher {
  private isWatching = false;
  private directoryHandle: any = null;
  private intervalId: any = null;
  private processedFileNames = new Set<string>();
  private onNewFilesCallback?: (files: File[]) => void;

  public async startWatch(
    handle: any,
    onNewFiles: (files: File[]) => void
  ) {
    this.directoryHandle = handle;
    this.onNewFilesCallback = onNewFiles;
    this.isWatching = true;

    // Scan initial files to prevent immediate re-processing
    await this.scanDirectory(true);

    // Poll every 3 seconds for new files
    this.intervalId = setInterval(async () => {
      if (this.isWatching && this.directoryHandle) {
        await this.scanDirectory(false);
      }
    }, 3000);
  }

  public stopWatch() {
    this.isWatching = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getStatus() {
    return this.isWatching;
  }

  private async scanDirectory(isInitial: boolean) {
    if (!this.directoryHandle) return;

    try {
      const newFiles: File[] = [];
      for await (const entry of this.directoryHandle.values()) {
        if (entry.kind === 'file') {
          const name = entry.name.toLowerCase();
          const isTargetExt = 
            name.endsWith('.ncm') ||
            name.endsWith('.qmc0') ||
            name.endsWith('.qmc3') ||
            name.endsWith('.qmcflac') ||
            name.endsWith('.qmcogg') ||
            name.endsWith('.mflac') ||
            name.endsWith('.mgg') ||
            name.endsWith('.kgm') ||
            name.endsWith('.vpr') ||
            name.endsWith('.kwm');

          if (isTargetExt) {
            if (!this.processedFileNames.has(entry.name)) {
              this.processedFileNames.add(entry.name);
              if (!isInitial) {
                const file = await entry.getFile();
                newFiles.push(file);
              }
            }
          }
        }
      }

      if (newFiles.length > 0 && this.onNewFilesCallback) {
        this.onNewFilesCallback(newFiles);
      }
    } catch (e) {
      console.warn('Directory scan error:', e);
    }
  }
}

export const directoryWatcher = new DirectoryWatcher();
