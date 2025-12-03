"use client";

import { useState } from "react";
import { approvePTORequest, rejectPTORequest } from "@/app/actions/manager-approvals";

type PTORequest = {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string | null;
  createdAt: Date;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
};

export function PTOApprovalCard({ request }: { request: PTORequest }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    setIsProcessing(true);
    const result = await approvePTORequest(request.id);
    if (!result.success) {
      alert(result.error || "Failed to approve request");
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    setIsProcessing(true);
    const result = await rejectPTORequest(request.id, rejectionReason);
    if (result.success) {
      setShowRejectDialog(false);
      setRejectionReason("");
    } else {
      alert(result.error || "Failed to reject request");
    }
    setIsProcessing(false);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium text-slate-900">
            {request.user.firstName} {request.user.lastName}
          </div>
          <div className="mt-1 text-sm text-slate-500">{request.user.email}</div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Type:</span>{" "}
              <span className="font-medium text-slate-900">
                {request.type.replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Duration:</span>{" "}
              <span className="font-medium text-slate-900">{request.days} days</span>
            </div>
            <div>
              <span className="text-slate-500">Start Date:</span>{" "}
              <span className="font-medium text-slate-900">
                {new Date(request.startDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">End Date:</span>{" "}
              <span className="font-medium text-slate-900">
                {new Date(request.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          {request.reason && (
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <div className="mb-1 font-medium text-slate-900">Reason:</div>
              {request.reason}
            </div>
          )}
        </div>
        <div className="ml-4 flex gap-2">
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => setShowRejectDialog(true)}
            disabled={isProcessing}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>

      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Reject PTO Request</h3>
            <p className="mt-1 text-sm text-slate-500">
              Please provide a reason for rejecting this request
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                }}
                disabled={isProcessing}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
