"use client";

import { useState, useEffect, useCallback } from "react";
import { firstTimer, squads, cith } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import {
  Search,
  Users,
  UserPlus,
  Heart,
  Clock,
  X,
  CheckCircle,
  Trash2,
  Edit3,
} from "lucide-react";

export default function AdminFirstTimersPage() {
  const { success, error } = useToast();
  const [tab, setTab] = useState<"first-timers" | "new-converts">("first-timers");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [firstTimers, setFirstTimers] = useState<any[]>([]);
  const [newConverts, setNewConverts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [squadList, setSquadList] = useState<any[]>([]);
  const [hubList, setHubList] = useState<any[]>([]);
  const [editingConvert, setEditingConvert] = useState<any>(null);
  const [editData, setEditData] = useState({
    assignedSquad: "",
    assignedHub: "",
    growthTrack: "",
    followUpSent: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, ftData, ncData] = await Promise.all([
        firstTimer.adminGetStats(),
        firstTimer.adminGetFirstTimers(search || undefined),
        firstTimer.adminGetNewConverts(search || undefined),
      ]);
      setStats(statsData);
      setFirstTimers(ftData || []);
      setNewConverts(ncData || []);
    } catch (err) {
      error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    squads
      .getSquads()
      .then((data) => setSquadList(data || []))
      .catch(() => {});
    cith
      .getHubs()
      .then((data) => setHubList(data || []))
      .catch(() => {});
  }, []);

  const handleDeleteFirstTimer = async (id: string, name: string) => {
    if (!confirm(`Remove first-timer record for "${name}"?`)) return;
    try {
      await firstTimer.adminDeleteFirstTimer(id);
      success("Record removed");
      fetchData();
    } catch {
      error("Failed to remove record");
    }
  };

  const handleDeleteNewConvert = async (id: string, name: string) => {
    if (!confirm(`Remove new convert record for "${name}"?`)) return;
    try {
      await firstTimer.adminDeleteNewConvert(id);
      success("Record removed");
      fetchData();
    } catch {
      error("Failed to remove record");
    }
  };

  const openEditConvert = (convert: any) => {
    setEditingConvert(convert);
    setEditData({
      assignedSquad: convert.assignedSquad || "",
      assignedHub: convert.assignedHub || "",
      growthTrack: convert.growthTrack || "",
      followUpSent: convert.followUpSent || false,
    });
  };

  const handleUpdateConvert = async () => {
    if (!editingConvert) return;
    try {
      await firstTimer.adminUpdateNewConvert(editingConvert.id, editData);
      success("Updated successfully");
      setEditingConvert(null);
      fetchData();
    } catch {
      error("Failed to update");
    }
  };

  const handleMarkFollowedUp = async (convert: any) => {
    try {
      await firstTimer.adminUpdateNewConvert(convert.id, {
        followUpSent: true,
      });
      success(`Marked ${convert.name} as followed up`);
      fetchData();
    } catch {
      error("Failed to update");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-slate mb-1">
        First Timers & New Converts
      </h1>
      <p className="font-body text-sm text-gray-text mb-6">
        Manage first-time visitors and new convert onboarding
      </p>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-[8px] bg-white border border-gray-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="h-5 w-5 text-purple" />
              <span className="font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                First Timers
              </span>
            </div>
            <p className="font-heading text-2xl font-bold text-slate">
              {stats.firstTimers}
            </p>
          </div>
          <div className="rounded-[8px] bg-white border border-gray-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-5 w-5 text-purple" />
              <span className="font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                New Converts
              </span>
            </div>
            <p className="font-heading text-2xl font-bold text-slate">
              {stats.newConverts}
            </p>
          </div>
          <div className="rounded-[8px] bg-white border border-gray-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                Followed Up
              </span>
            </div>
            <p className="font-heading text-2xl font-bold text-green-700">
              {stats.followedUp}
            </p>
          </div>
          <div className="rounded-[8px] bg-white border border-gray-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                Pending Follow-up
              </span>
            </div>
            <p className="font-heading text-2xl font-bold text-amber-700">
              {stats.pendingFollowUp}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-[8px] p-1 w-fit">
        <button
          onClick={() => setTab("first-timers")}
          className={`px-4 py-2 rounded-[6px] font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === "first-timers"
              ? "bg-white text-purple shadow-sm"
              : "text-gray-text hover:text-slate"
          }`}
        >
          First Timers ({firstTimers.length})
        </button>
        <button
          onClick={() => setTab("new-converts")}
          className={`px-4 py-2 rounded-[6px] font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === "new-converts"
              ? "bg-white text-purple shadow-sm"
              : "text-gray-text hover:text-slate"
          }`}
        >
          New Converts ({newConverts.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-text" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-[8px] border border-gray-border bg-white pl-10 pr-4 py-2.5 font-body text-sm text-slate placeholder:text-gray-text focus:outline-none focus:border-purple transition-colors"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="font-body text-sm text-gray-text">Loading...</p>
        </div>
      )}

      {/* First Timers Table */}
      {!loading && tab === "first-timers" && (
        <div className="bg-white rounded-[8px] border border-gray-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-gray-border">
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {firstTimers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 font-body text-sm text-gray-text"
                    >
                      No first-timer records found
                    </td>
                  </tr>
                ) : (
                  firstTimers.map((ft) => (
                    <tr
                      key={ft.id}
                      className="border-b border-gray-border last:border-0 hover:bg-off-white/50"
                    >
                      <td className="px-4 py-3 font-body text-sm font-medium text-slate">
                        {ft.name}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-text">
                        {ft.email}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-text">
                        {ft.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-purple/10 px-2.5 py-0.5 font-heading text-xs font-semibold text-purple capitalize">
                          {ft.source?.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-text">
                        {new Date(ft.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteFirstTimer(ft.id, ft.name)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Converts Table */}
      {!loading && tab === "new-converts" && (
        <div className="bg-white rounded-[8px] border border-gray-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-gray-border">
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Growth Track
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Squad / Hub
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Follow-up
                  </th>
                  <th className="text-left px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-heading text-xs font-semibold text-gray-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {newConverts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 font-body text-sm text-gray-text"
                    >
                      No new convert records found
                    </td>
                  </tr>
                ) : (
                  newConverts.map((nc) => (
                    <tr
                      key={nc.id}
                      className="border-b border-gray-border last:border-0 hover:bg-off-white/50"
                    >
                      <td className="px-4 py-3 font-body text-sm font-medium text-slate">
                        {nc.name}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-text">
                        {nc.email}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-text">
                        {nc.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-purple/10 px-2.5 py-0.5 font-heading text-xs font-semibold text-purple">
                          {nc.growthTrack?.replace(/_/g, " ") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-xs text-gray-text">
                        <div>{nc.assignedSquad || "—"}</div>
                        <div className="text-gray-text/60">{nc.assignedHub || ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        {nc.followUpSent ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 font-heading text-xs font-semibold text-green-700">
                            <CheckCircle className="h-3 w-3" /> Done
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkFollowedUp(nc)}
                            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-heading text-xs font-semibold text-amber-700 hover:bg-amber-200 transition-colors cursor-pointer"
                          >
                            <Clock className="h-3 w-3" /> Pending
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-text">
                        {new Date(nc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditConvert(nc)}
                            className="text-purple hover:text-purple-dark transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteNewConvert(nc.id, nc.name)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit New Convert Modal */}
      {editingConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-slate">
                Edit: {editingConvert.name}
              </h3>
              <button
                onClick={() => setEditingConvert(null)}
                className="text-gray-text hover:text-slate"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                  Growth Track
                </label>
                <select
                  value={editData.growthTrack}
                  onChange={(e) =>
                    setEditData({ ...editData, growthTrack: e.target.value })
                  }
                  className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                >
                  <option value="">Select a growth track</option>
                  <option value="FOUNDATION_CLASS">Foundation Class</option>
                  <option value="GROW_WITH_US">Grow With Us</option>
                  <option value="INTENTIONALITY_CLASS">
                    Intentionality Class
                  </option>
                  <option value="DISCIPLESHIP">Discipleship</option>
                </select>
              </div>

              <div>
                <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                  Assigned Squad
                </label>
                <select
                  value={editData.assignedSquad}
                  onChange={(e) =>
                    setEditData({ ...editData, assignedSquad: e.target.value })
                  }
                  className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                >
                  <option value="">No squad assigned</option>
                  {squadList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                  Assigned CITH Hub
                </label>
                <select
                  value={editData.assignedHub}
                  onChange={(e) =>
                    setEditData({ ...editData, assignedHub: e.target.value })
                  }
                  className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                >
                  <option value="">No hub assigned</option>
                  {hubList.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name} — {h.area}, {h.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="followUpSent"
                  checked={editData.followUpSent}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      followUpSent: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-purple rounded"
                />
                <label
                  htmlFor="followUpSent"
                  className="font-body text-sm text-slate"
                >
                  Follow-up completed
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingConvert(null)}
                className="flex-1 rounded-[4px] border-2 border-gray-border px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-gray-text hover:bg-off-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateConvert}
                className="flex-1 rounded-[4px] bg-purple px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-purple-hover transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
