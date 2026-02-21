"use client";

import { FormEvent, useState } from "react";
import {
  AdminCreateSportEventDocument,
  AdminDeleteSportEventDocument,
  AdminUpdateSportEventDocument,
  SportEventType,
} from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";
import { datePartsToInput, parseOptionalInt } from "@/components/admin/helpers";
import { useAdminDashboard } from "@/components/admin/useAdminDashboard";
import {
  AdminCard,
  AdminFeedback,
  AdminLoading,
  AdminPageHeader,
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderClass,
  textareaClass,
} from "@/components/admin/ui";

export default function AdminEventsPage() {
  const { dashboard, loading, error, message, runMutation, setError } =
    useAdminDashboard();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2024-01-01");
  const [sportId, setSportId] = useState("");
  const [type, setType] = useState<SportEventType>(SportEventType.MatchResult);
  const [fullDescription, setFullDescription] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("2024-01-01");
  const [editSportId, setEditSportId] = useState("");
  const [editType, setEditType] = useState<SportEventType>(SportEventType.MatchResult);
  const [editFullDescription, setEditFullDescription] = useState("");
  const [editCompetitionId, setEditCompetitionId] = useState("");
  const [editLocationId, setEditLocationId] = useState("");
  const [editMediaUrl, setEditMediaUrl] = useState("");

  const events = dashboard?.adminSportEvents ?? [];
  const sports = dashboard?.adminSports ?? [];
  const competitions = dashboard?.adminCompetitions ?? [];
  const locations = dashboard?.adminLocations ?? [];

  function validateDate(value: string): Date | null {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      setError("Date is invalid.");
      return null;
    }

    return parsedDate;
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSportId = parseOptionalInt(sportId);
    if (!parsedSportId) {
      setError("Sport is required.");
      return;
    }

    const parsedDate = validateDate(date);
    if (!parsedDate) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminCreateSportEventDocument,
          {
            title,
            date: parsedDate.toISOString(),
            sportId: parsedSportId,
            type,
            fullDescription: fullDescription || null,
            competitionId: parseOptionalInt(competitionId),
            locationId: parseOptionalInt(locationId),
            mediaUrl: mediaUrl || null,
          },
          { accessToken },
        );

        setTitle("");
        setDate("2024-01-01");
        setSportId("");
        setFullDescription("");
        setCompetitionId("");
        setLocationId("");
        setMediaUrl("");
      },
      "Event created successfully.",
    );
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    const parsedSportId = parseOptionalInt(editSportId);
    if (!parsedSportId) {
      setError("Sport is required for update.");
      return;
    }

    const parsedDate = validateDate(editDate);
    if (!parsedDate) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminUpdateSportEventDocument,
          {
            id: editingId,
            title: editTitle,
            date: parsedDate.toISOString(),
            sportId: parsedSportId,
            type: editType,
            fullDescription: editFullDescription || null,
            competitionId: parseOptionalInt(editCompetitionId),
            locationId: parseOptionalInt(editLocationId),
            mediaUrl: editMediaUrl || null,
          },
          { accessToken },
        );

        setEditingId(null);
      },
      "Event updated successfully.",
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        const result = await executeGraphql(
          AdminDeleteSportEventDocument,
          { id },
          { accessToken },
        );

        if (!result.deleteSportEvent) {
          throw new Error("Event was not found.");
        }
      },
      "Event deleted successfully.",
    );
  }

  function startEdit(item: (typeof events)[number]) {
    setEditingId(item.id);
    setEditTitle(item.headline ?? "");
    setEditDate(datePartsToInput(item.year, item.month, item.day));
    setEditSportId(String(item.sportId));
    setEditType(item.type);
    setEditFullDescription(item.fullDescription ?? "");
    setEditCompetitionId(item.competitionId ? String(item.competitionId) : "");
    setEditLocationId(item.locationId ? String(item.locationId) : "");
    setEditMediaUrl(item.mediaUrl ?? "");
  }

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader title="مدیریت رویدادها" description="CRUD کامل رویدادها" />
      <AdminFeedback message={message} error={error} />

      <AdminCard title="ایجاد رویداد جدید">
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClass}
            placeholder="Title"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
            required
          />
          <select
            value={sportId}
            onChange={(event) => setSportId(event.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={String(sport.id)}>
                {sport.id} - {sport.name}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as SportEventType)}
            className={inputClass}
          >
            {Object.values(SportEventType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={competitionId}
            onChange={(event) => setCompetitionId(event.target.value)}
            className={inputClass}
          >
            <option value="">Select competition</option>
            {competitions.map((competition) => (
              <option key={competition.id} value={String(competition.id)}>
                {competition.id} - {competition.name}
              </option>
            ))}
          </select>
          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className={inputClass}
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={String(location.id)}>
                {location.id} - {location.name ?? "Unnamed"}
              </option>
            ))}
          </select>
          <input
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
            className={inputClass}
            placeholder="Media URL"
          />
          <textarea
            value={fullDescription}
            onChange={(event) => setFullDescription(event.target.value)}
            className={`${textareaClass} md:col-span-2`}
            placeholder="Full description"
          />
          <button type="submit" className={`${primaryButtonClass} md:col-span-2`}>
            Create Event
          </button>
        </form>
      </AdminCard>

      <AdminCard title="لیست رویدادها">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className={tableHeaderClass}>ID</th>
                <th className={tableHeaderClass}>Title</th>
                <th className={tableHeaderClass}>Date</th>
                <th className={tableHeaderClass}>Sport / Type</th>
                <th className={tableHeaderClass}>Slug</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="border-b align-top">
                    <td className={tableCellClass}>{item.id}</td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <input
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        item.headline ?? "-"
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editDate}
                          onChange={(event) => setEditDate(event.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        datePartsToInput(item.year, item.month, item.day)
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <select
                            value={editSportId}
                            onChange={(event) => setEditSportId(event.target.value)}
                            className={inputClass}
                          >
                            {sports.map((sport) => (
                              <option key={sport.id} value={String(sport.id)}>
                                {sport.id} - {sport.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editType}
                            onChange={(event) =>
                              setEditType(event.target.value as SportEventType)
                            }
                            className={inputClass}
                          >
                            {Object.values(SportEventType).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <p>{item.sport?.name ?? "-"}</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </>
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <select
                            value={editCompetitionId}
                            onChange={(event) => setEditCompetitionId(event.target.value)}
                            className={inputClass}
                          >
                            <option value="">Select competition</option>
                            {competitions.map((competition) => (
                              <option key={competition.id} value={String(competition.id)}>
                                {competition.id} - {competition.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editLocationId}
                            onChange={(event) => setEditLocationId(event.target.value)}
                            className={inputClass}
                          >
                            <option value="">Select location</option>
                            {locations.map((location) => (
                              <option key={location.id} value={String(location.id)}>
                                {location.id} - {location.name ?? "Unnamed"}
                              </option>
                            ))}
                          </select>
                          <input
                            value={editMediaUrl}
                            onChange={(event) => setEditMediaUrl(event.target.value)}
                            className={inputClass}
                            placeholder="Media URL"
                          />
                          <textarea
                            value={editFullDescription}
                            onChange={(event) =>
                              setEditFullDescription(event.target.value)
                            }
                            className={textareaClass}
                            placeholder="Full description"
                          />
                        </div>
                      ) : (
                        item.slug
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <form onSubmit={handleUpdate} className="flex flex-wrap gap-2">
                          <button type="submit" className={primaryButtonClass}>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className={secondaryButtonClass}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className={secondaryButtonClass}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className={dangerButtonClass}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </section>
  );
}
