import { memo, CSSProperties, MouseEvent } from 'react';
import { theme, buttonStyles, mergeStyles, getOpacity, getCursor } from '../../styles';

export type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'info';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /**
   * Visual style variant of the button
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Additional custom styles
   */
  style?: CSSProperties;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Button type attribute
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Tooltip text
   */
  title?: string;

  /**
   * Full width button
   */
  fullWidth?: boolean;
}

/**
 * Reusable button component with consistent styling and behavior.
 *
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * @example
 * // Disabled button
 * <Button variant="success" disabled>
 *   Processing...
 * </Button>
 *
 * @example
 * // Small danger button
 * <Button variant="danger" size="sm" onClick={handleDelete}>
 *   Delete
 * </Button>
 */
export const Button = memo(function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  style: customStyle,
  className,
  type = 'button',
  title,
  fullWidth = false,
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const buttonStyle = mergeStyles(
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    disabled && buttonStyles.states.disabled,
    {
      cursor: getCursor(disabled),
      opacity: getOpacity(disabled),
      width: fullWidth ? '100%' : 'auto',
    },
    customStyle
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={buttonStyle}
      className={className}
      title={title}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
        }
      }}
    >
      {children}
    </button>
  );
});
