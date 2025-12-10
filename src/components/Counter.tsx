interface Props {
  counter: number;
  maxStaementNumber: number;
}

function Counter({ counter, maxStaementNumber }: Props) {
  return (
    <div
      className="text-end border-primary rounded"
      style={{ paddingRight: "5px" }}
    >
      <div className="rounded">
        {counter + 1} / {maxStaementNumber}
      </div>
    </div>
  );
}

export default Counter;
