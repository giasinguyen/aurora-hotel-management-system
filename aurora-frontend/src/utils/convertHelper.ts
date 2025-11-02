import { convert } from "html-to-text";

export function formatISO(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatISOToYMD(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getFirstLineFromHtml(html: string): string {
  const plainText = convert(html, {
    wordwrap: false,
    selectors: [{ selector: "a", format: "inline" }],
  });

  return (
    plainText
      .split(/\r?\n/)
      .find((line) => line.trim() !== "")
      ?.trim() ?? ""
  );
}

export const formatSalary = (salary: number) => {
  if (salary === 0) return "Negotiable";
  return `${salary.toLocaleString()} VND`;
};

export const formatLoginTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  switch (true) {
    case diffMinutes < 1:
      return "Just logged in";
    case diffMinutes < 5:
      return "Less than 5 minutes ago";
    case diffMinutes < 15:
      return "Less than 15 minutes ago";
    case diffMinutes < 30:
      return "Less than 30 minutes ago";
    case diffMinutes < 60:
      return `${diffMinutes} minutes ago`;
    case diffHours === 1:
      return "1 hour ago";
    case diffHours < 24:
      return `${diffHours} hours ago`;
    case diffDays === 1:
      return "1 day ago";
    case diffDays < 7:
      return `${diffDays} days ago`;
    default:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  }
};
