import { Button } from "./ui/button";

type CompletedToggleButtonProps = {
  isCompleted: boolean;
  onCompletedChange: (isCompleted: boolean) => void;
  disabled?: boolean;
};

export default function CompletedToggleButton({
  onCompletedChange,
  disabled = false,
  isCompleted,
}: CompletedToggleButtonProps) {
  return (
    <Button
      type="button"
      variant={isCompleted ? "primary" : "outline"}
      onClick={() => onCompletedChange(!isCompleted)}
      disabled={disabled}
    >
      {isCompleted ? "Completed" : "Not completed"}
    </Button>
  );
}
