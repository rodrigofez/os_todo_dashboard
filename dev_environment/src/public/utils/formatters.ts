/**
 * Transforms snake_case or kebab-case to Title Case
 * @example formatLabel('in_progress') => 'In Progress'
 * @example formatLabel('high') => 'High'
 */
export const formatLabel = (label: string): string => {
  return label
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
