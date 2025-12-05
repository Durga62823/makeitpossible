"use client";

import { useState } from "react";
import { moveTask, assignTask } from "@/app/actions/lead-tasks";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigneeId: string | null;
  storyPoints: number | null;
  project: { id: string; name: string } | null;
  sprint: { id: string; name: string } | null;
};

type TaskBoardProps = {
  tasks: Task[];
  teamMembers: Array<{ id: string; name: string | null; image: string | null }>;
  sprints: Array<{ id: string; name: string; status: string }>;
  projects: Array<{ id: string; name: string }>;
};

const statusColumns = [
  { key: "TODO", label: "To Do", color: "gray" },
  { key: "IN_PROGRESS", label: "In Progress", color: "blue" },
  { key: "IN_REVIEW", label: "In Review", color: "purple" },
  { key: "BLOCKED", label: "Blocked", color: "red" },
  { key: "DONE", label: "Done", color: "green" },
];

export function TaskBoard({ tasks, teamMembers, sprints, projects }: TaskBoardProps) {
  const [filter, setFilter] = useState<{
    sprint?: string;
    project?: string;
    assignee?: string;
  }>({});

  const filteredTasks = tasks.filter((task) => {
    if (filter.sprint && task.sprint?.id !== filter.sprint) return false;
    if (filter.project && task.project?.id !== filter.project) return false;
    if (filter.assignee && task.assigneeId !== filter.assignee) return false;
    return true;
  });

  const handleMoveTask = async (taskId: string, newStatus: string) => {
    const result = await moveTask(taskId, newStatus as any);
    if (!result.success) {
      alert(`Failed to move task: ${result.error}`);
    }
  };

  const handleAssignTask = async (taskId: string, assigneeId: string) => {
    const result = await assignTask(taskId, assigneeId);
    if (!result.success) {
      alert(`Failed to assign task: ${result.error}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sprint</label>
            <select
              value={filter.sprint || ""}
              onChange={(e) => setFilter({ ...filter, sprint: e.target.value || undefined })}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Sprints</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={filter.project || ""}
              onChange={(e) => setFilter({ ...filter, project: e.target.value || undefined })}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <select
              value={filter.assignee || ""}
              onChange={(e) => setFilter({ ...filter, assignee: e.target.value || undefined })}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Members</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {(filter.sprint || filter.project || filter.assignee) && (
            <div className="flex items-end">
              <button
                onClick={() => setFilter({})}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4">
        {statusColumns.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column.key);

          return (
            <div key={column.key} className="bg-gray-50 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{column.label}</h3>
                <span className="text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const assignee = teamMembers.find((m) => m.id === task.assigneeId);
                  const priorityColors = {
                    LOW: "bg-gray-100 text-gray-800",
                    MEDIUM: "bg-blue-100 text-blue-800",
                    HIGH: "bg-orange-100 text-orange-800",
                    URGENT: "bg-red-100 text-red-800",
                  };

                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {task.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            priorityColors[task.priority as keyof typeof priorityColors]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          {task.storyPoints && (
                            <span className="font-medium">{task.storyPoints} pts</span>
                          )}
                          {task.project && (
                            <span className="truncate max-w-20">{task.project.name}</span>
                          )}
                        </div>

                        {assignee && (
                          <div className="flex items-center gap-1">
                            {assignee.image ? (
                              <img
                                src={assignee.image}
                                alt={assignee.name || ""}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                                {assignee.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                        {column.key !== "TODO" && column.key !== "DONE" && (
                          <select
                            value={task.status}
                            onChange={(e) => handleMoveTask(task.id, e.target.value)}
                            className="text-xs flex-1 rounded border-gray-300"
                          >
                            {statusColumns.map((col) => (
                              <option key={col.key} value={col.key}>
                                {col.label}
                              </option>
                            ))}
                          </select>
                        )}
                        <select
                          value={task.assigneeId || ""}
                          onChange={(e) => handleAssignTask(task.id, e.target.value)}
                          className="text-xs flex-1 rounded border-gray-300"
                        >
                          <option value="">Unassigned</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
