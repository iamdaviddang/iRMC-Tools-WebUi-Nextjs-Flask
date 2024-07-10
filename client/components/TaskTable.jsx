import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const TaskTable = ({ tasks }) => {
  if (tasks.length === 0) {
    console.log("je prazdny");
  }
  return (
    <div>
      {tasks.length === 0 ? (
        <h1>History is empty</h1>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>USN / iRMC-IP</TableHead>
              <TableHead>Type of Request</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks
              .slice()
              .reverse()
              .map(
                (
                  task
                ) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.usn}</TableCell>
                    <TableCell>{task.type_of_task}</TableCell>
                    <TableCell
                      className="font-semibold"
                      style={{
                        color:
                          task.status === "ok"
                            ? "green"
                            : task.status === "bad"
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {task.status}
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TaskTable;
