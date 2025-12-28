import React from "react";
import Scheduler from "./components/Scheduler";

const SchedulerPage = () => {
  return (
    <div className="grid grid-cols-3 w-full pr-2 pl-4">
      <Scheduler />
    </div>
  );
};

export default SchedulerPage;
