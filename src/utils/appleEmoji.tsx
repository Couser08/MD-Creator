import React from 'react';

// Common shortcodes mapped to their unified hex codes
const SHORTCODE_MAP: Record<string, string> = {
  rocket: '1f680',
  fire: '1f525',
  sparkles: '2728',
  heart: '2764-fe0f',
  star: '2b50',
  check: '2705',
  zap: '26a1',
  bulb: '1f4a1',
  memo: '1f4dd',
  book: '1f4d6',
  apple: '1f34e',
  smile: '1f604',
  laugh: '1f602',
  wave: '1f44b',
  eyes: '1f440',
  tada: '1f389',
  party: '1f389',
  gear: '2699-fe0f',
  lock: '1f512',
  key: '1f511',
  warning: '26a0-fe0f',
  info: '2139-fe0f',
  pin: '1f4cc',
  link: '1f517',
  laptop: '1f4bb',
  phone: '1f4f1',
  calendar: '1f4c5',
  folder: '1f4c1',
  trash: '1f5d1-fe0f',
  art: '1f3a8',
  pencil: '270f-fe0f',
};

// Converts any unicode emoji to Apple unified hex filename
export function emojiToUnified(emoji: string): string {
  const codePoints: string[] = [];
  for (const ch of Array.from(emoji)) {
    const cp = ch.codePointAt(0);
    if (cp) {
      codePoints.push(cp.toString(16).toLowerCase());
    }
  }
  return codePoints.join('-');
}

export function getAppleEmojiUrl(emojiOrShortcode: string): string {
  let unified = '';
  if (emojiOrShortcode.startsWith(':') && emojiOrShortcode.endsWith(':')) {
    const code = emojiOrShortcode.slice(1, -1).toLowerCase();
    unified = SHORTCODE_MAP[code] || '';
  } else {
    unified = emojiToUnified(emojiOrShortcode);
  }

  if (!unified) {
    unified = '2728'; // default sparkles fallback
  }

  return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${unified}.png`;
}

// Regex matching unicode pictographics, emojis, and shortcodes (:rocket:)
export const EMOJI_REGEX = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*|:[a-zA-Z0-9_+-]+:)/gu;

interface AppleEmojiProps {
  emoji: string;
  className?: string;
  size?: number | string;
  alt?: string;
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({ 
  emoji, 
  className = '', 
  size = '1.25em',
  alt 
}) => {
  const [hasError, setHasError] = React.useState(false);
  const src = getAppleEmojiUrl(emoji);

  if (hasError) {
    return <span className={`inline-block select-none ${className}`}>{emoji}</span>;
  }

  return (
    <img
      src={src}
      alt={alt || emoji}
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      style={typeof size === 'string' ? { width: size, height: size } : undefined}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={`inline-block align-[-0.2em] mx-[0.08em] select-none pointer-events-none ${className}`}
    />
  );
};

// Replaces all emojis in a plain text string with AppleEmoji components
export function renderWithAppleEmojis(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') return text;

  const parts = text.split(EMOJI_REGEX);
  if (parts.length <= 1) return text;

  return parts.map((part, index) => {
    if (index % 2 === 1 && part) {
      return <AppleEmoji key={`emoji_${index}_${part}`} emoji={part} />;
    }
    return part;
  });
}

// Recursively replaces emojis in React children
export function replaceEmojisInReactNode(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') {
    return renderWithAppleEmojis(node);
  }
  if (Array.isArray(node)) {
    return React.Children.map(node, (child) => replaceEmojisInReactNode(child));
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props && props.children) {
      return React.cloneElement(node as React.ReactElement<any>, {
        children: replaceEmojisInReactNode(props.children)
      });
    }
  }
  return node;
}
