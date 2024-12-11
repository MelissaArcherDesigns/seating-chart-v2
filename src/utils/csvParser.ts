export function parseCSV(content: string): string[] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const [name] = line.split(',');
      return name.trim();
    })
    .filter(name => name.length > 0);
}