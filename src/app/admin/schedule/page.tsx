"use client";

import { useState, useEffect, useCallback } from "react";
import { serviceSchedule } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";

interface ScheduleItem {
  id: string;
  day: string;
  dayLabel?: string | null;
  name: string;
  time: string;
  description: string;
  order: number;
  active: boolean;
}

const emptyForm = {
  day: "",
  dayLabel: "",
  name: "",
  time: "",
  description: "",
  order: 0,
  active: true,
};

export default function AdminSchedulePage() {
  const { success, error } = useToast();
  const [services, setServices] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceSchedule.adminGetAll();
      setServices(data || []);
    } catch {
      error("Failed to load service schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order: services.length + 1,
    });
    setShowModal(true);
  };

  const openEdit = (svc: ScheduleItem) => {
    setEditingId(svc.id);
    setForm({
      day: svc.day,
      dayLabel: svc.dayLabel || "",
      name: svc.name,
      time: svc.time,
      description: svc.description,
      order: svc.order,
      active: svc.active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.day || !form.name || !form.time) {
      error("Day, name, and time are required");
      return;
    }

    try {
      const payload = {
        day: form.day,
        dayLabel: form.dayLabel || undefined,
        name: form.name,
        time: form.time,
        description: form.description,
        order: form.order,
        active: form.active,
      };

      if (editingId) {
        await serviceSchedule.adminUpdate(editingId, payload);
        success("Service updated");
      } else {
        await serviceSchedule.adminCreate(payload);
        success("Service added");
      }
      setShowModal(false);
      fetchServices();
    } catch {
      error("Failed to save");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" from the schedule?`)) return;
    try {
      await serviceSchedule.adminDelete(id);
      success("Service removed");
      fetchServices();
    } catch {
      error("Failed to delete");
    }
  };

  const handleToggleActive = async (svc: ScheduleItem) => {
    try {
      await serviceSchedule.adminUpdate(svc.id, { active: !svc.active });
      success(svc.active ? "Service hidden" : "Service visible");
      fetchServices();
    } catch {
      error("Failed to update");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate mb-1">
            Service Schedule
          </h1>
          <p className="font-body text-sm text-gray-text">
            Manage your church service days and times. Changes appear on the
            homepage and live page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-[4px] bg-purple px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-purple-hover transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Service List */}
      {loading ? (
        <div className="text-center py-16">
          <p className="font-body text-sm text-gray-text">Loading...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[8px] border border-gray-border">
          <Clock className="mx-auto h-10 w-10 text-gray-text/40 mb-3" />
          <p className="font-body text-sm text-gray-text mb-4">
            No services configured yet. Add your first service to get started.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-[4px] bg-purple px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-purple-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`flex items-center gap-4 rounded-[8px] border bg-white p-5 transition-all ${
                svc.active
                  ? "border-gray-border"
                  : "border-dashed border-gray-border/50 opacity-60"
              }`}
            >
              <div className="text-gray-text/30">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Day + Time */}
              <div className="w-28 shrink-0">
                <p className="font-heading text-lg font-bold text-slate leading-tight">
                  {svc.day}
                </p>
                {svc.dayLabel && (
                  <p className="font-body text-[10px] text-gray-text">
                    {svc.dayLabel}
                  </p>
                )}
                <p className="font-heading text-sm font-semibold text-purple mt-1">
                  {svc.time}
                </p>
              </div>

              {/* Name + Description */}
              <div className="flex-1 min-w-0">
                <p className="font-heading text-base font-bold text-slate">
                  {svc.name}
                </p>
                <p className="font-body text-sm text-gray-text mt-0.5 truncate">
                  {svc.description}
                </p>
              </div>

              {/* Status badge */}
              <div>
                {svc.active ? (
                  <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 font-heading text-xs font-semibold text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 font-heading text-xs font-semibold text-gray-text">
                    Hidden
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(svc)}
                  className="p-2 rounded-md hover:bg-off-white transition-colors text-gray-text"
                  title={svc.active ? "Hide" : "Show"}
                >
                  {svc.active ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(svc)}
                  className="p-2 rounded-md hover:bg-off-white transition-colors text-purple"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(svc.id, svc.name)}
                  className="p-2 rounded-md hover:bg-off-white transition-colors text-red-500"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[8px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-lg font-bold text-slate">
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-text hover:text-slate"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                    Day *
                  </label>
                  <input
                    type="text"
                    value={form.day}
                    onChange={(e) =>
                      setForm({ ...form, day: e.target.value })
                    }
                    placeholder="e.g. Sunday, Tuesday"
                    className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                    Day Label (optional)
                  </label>
                  <input
                    type="text"
                    value={form.dayLabel}
                    onChange={(e) =>
                      setForm({ ...form, dayLabel: e.target.value })
                    }
                    placeholder="e.g. of every month"
                    className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Word & Life Service"
                    className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                    placeholder="e.g. 8:00 AM"
                    className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief description of this service..."
                  rows={2}
                  className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-xs font-semibold text-gray-text mb-1 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    className="w-full rounded-[8px] border-2 border-[#E8E6F0] bg-white px-4 py-2.5 font-body text-sm text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      className="h-4 w-4 accent-purple rounded"
                    />
                    <span className="font-body text-sm text-slate">
                      Visible on website
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-[4px] border-2 border-gray-border px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-gray-text hover:bg-off-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-[4px] bg-purple px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-purple-hover transition-colors"
              >
                {editingId ? "Save Changes" : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
