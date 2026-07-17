export interface ClipboardWriter {
  writeText(text: string): Promise<void>;
}

export async function copyText(
  text: string,
  clipboard: ClipboardWriter,
): Promise<boolean> {
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
