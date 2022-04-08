export default function stringToLower(s: any) {
  try {
    return s.toLowerCase();
  } catch (e) {
    return s;
  }
}
