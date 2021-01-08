import benchmark from "benchmark";
import _ from "lodash";
import process from "process";

export const getCPUScore = async () => {
  return new Promise<number>((res) => {
    const Benchmark = benchmark.runInContext({
      _,
      process,
    }) as typeof benchmark;
    if (typeof window !== "undefined") (window as any).Benchmark = Benchmark;

    const suite = new Benchmark.Suite();

    suite
      .add("Adding numbers", () => 1 + 1 === 2)
      .on("complete", function () {
        const score = Math.floor(
          this.reduce((all: number, curr: any) => {
            return all + curr.hz;
          }, 0) /
            this.length /
            100000
        );

        res(score);
      })
      .run({ async: true, maxTime: 5 });
  });
};
