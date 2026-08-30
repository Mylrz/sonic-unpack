/**
 * Recursively scans files and directories from DataTransferItemList
 * Supports nested subdirectories of arbitrary depth
 */
export async function extractFilesFromDataTransfer(
  items: DataTransferItemList | FileList
): Promise<File[]> {
  const fileList: File[] = [];

  // Check if DataTransferItem with webkitGetAsEntry is supported
  if (items.length > 0 && 'webkitGetAsEntry' in items[0]) {
    const entries: any[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as DataTransferItem;
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          entries.push(entry);
        }
      }
    }

    for (const entry of entries) {
      const files = await traverseFileTree(entry);
      fileList.push(...files);
    }

    return fileList;
  }

  // Fallback to flat file list
  for (let i = 0; i < items.length; i++) {
    const file = (items as any)[i] as File;
    if (file) {
      fileList.push(file);
    }
  }

  return fileList;
}

async function traverseFileTree(item: any, path: string = ''): Promise<File[]> {
  if (item.isFile) {
    return new Promise((resolve) => {
      item.file(
        (file: File) => {
          resolve([file]);
        },
        (err: any) => {
          console.warn('Read file error:', err);
          resolve([]);
        }
      );
    });
  } else if (item.isDirectory) {
    const dirReader = item.createReader();
    const entries = await readAllDirectoryEntries(dirReader);
    const results: File[] = [];

    for (const entry of entries) {
      const nestedFiles = await traverseFileTree(entry, `${path + item.name}/`);
      results.push(...nestedFiles);
    }

    return results;
  }

  return [];
}

/**
 * readEntries in webkit directory reader may return results in batches of 100
 */
async function readAllDirectoryEntries(dirReader: any): Promise<any[]> {
  const entries: any[] = [];
  
  const readBatch = (): Promise<any[]> => {
    return new Promise((resolve) => {
      dirReader.readEntries(
        (batch: any[]) => resolve(batch),
        (err: any) => {
          console.warn('Read directory batch error:', err);
          resolve([]);
        }
      );
    });
  };

  let batch = await readBatch();
  while (batch.length > 0) {
    entries.push(...batch);
    batch = await readBatch();
  }

  return entries;
}
