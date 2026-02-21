"use client";

import { FormEvent, useState } from "react";
import {
  AdminCreateTeamDocument,
  AdminDeleteTeamDocument,
  AdminUpdateTeamDocument,
} from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";
import { parseIdCsv, parseOptionalInt, toYearNumber } from "@/components/admin/helpers";
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

export default function AdminTeamsPage() {
  const { dashboard, loading, error, message, runMutation, setError } =
    useAdminDashboard();

  const [name, setName] = useState("");
  const [foundedYear, setFoundedYear] = useState("2000");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sportId, setSportId] = useState("");
  const [locationId, setLocationId] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFoundedYear, setEditFoundedYear] = useState("2000");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIconUrl, setEditIconUrl] = useState("");
  const [editWebsiteUrl, setEditWebsiteUrl] = useState("");
  const [editSportId, setEditSportId] = useState("");
  const [editLocationId, setEditLocationId] = useState("");
  const [editMemberIds, setEditMemberIds] = useState("");

  const teams = dashboard?.adminTeams ?? [];
  const sports = dashboard?.adminSports ?? [];
  const locations = dashboard?.adminLocations ?? [];

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedFoundedYear = parseOptionalInt(foundedYear);
    if (!parsedFoundedYear) {
      setError("Founded year is required.");
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminCreateTeamDocument,
          {
            name,
            foundedYear: parsedFoundedYear,
            slug: slug || null,
            description: description || null,
            iconUrl: iconUrl || null,
            websiteUrl: websiteUrl || null,
            sportId: parseOptionalInt(sportId),
            locationId: parseOptionalInt(locationId),
          },
          { accessToken },
        );

        setName("");
        setFoundedYear("2000");
        setSlug("");
        setDescription("");
        setIconUrl("");
        setWebsiteUrl("");
        setSportId("");
        setLocationId("");
      },
      "Team created successfully.",
    );
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    const parsedFoundedYear = parseOptionalInt(editFoundedYear);
    if (!parsedFoundedYear) {
      setError("Founded year is required for update.");
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminUpdateTeamDocument,
          {
            id: editingId,
            name: editName,
            foundedYear: parsedFoundedYear,
            slug: editSlug || null,
            description: editDescription || null,
            iconUrl: editIconUrl || null,
            websiteUrl: editWebsiteUrl || null,
            sportId: parseOptionalInt(editSportId),
            locationId: parseOptionalInt(editLocationId),
            memberIds: editMemberIds.trim() ? parseIdCsv(editMemberIds) : null,
          },
          { accessToken },
        );

        setEditingId(null);
      },
      "Team updated successfully.",
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this team?")) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        const result = await executeGraphql(
          AdminDeleteTeamDocument,
          { id },
          { accessToken },
        );

        if (!result.deleteTeam) {
          throw new Error("Team was not found.");
        }
      },
      "Team deleted successfully.",
    );
  }

  function startEdit(item: (typeof teams)[number]) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditFoundedYear(String(toYearNumber(item.foundedYear)));
    setEditSlug(item.slug);
    setEditDescription(item.description ?? "");
    setEditIconUrl(item.iconUrl ?? "");
    setEditWebsiteUrl(item.websiteUrl ?? "");
    setEditSportId(item.sport?.id ? String(item.sport.id) : "");
    setEditLocationId(item.location?.id ? String(item.location.id) : "");
    setEditMemberIds("");
  }

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader title="مدیریت تیم‌ها" description="CRUD کامل تیم‌ها" />
      <AdminFeedback message={message} error={error} />

      <AdminCard title="ایجاد تیم جدید">
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Name"
            required
          />
          <input
            value={foundedYear}
            onChange={(event) => setFoundedYear(event.target.value)}
            className={inputClass}
            placeholder="Founded year"
            required
          />
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={inputClass}
            placeholder="Slug"
          />
          <input
            value={iconUrl}
            onChange={(event) => setIconUrl(event.target.value)}
            className={inputClass}
            placeholder="Icon URL"
          />
          <input
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            className={inputClass}
            placeholder="Website URL"
          />
          <select
            value={sportId}
            onChange={(event) => setSportId(event.target.value)}
            className={inputClass}
          >
            <option value="">Select sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={String(sport.id)}>
                {sport.id} - {sport.name}
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
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${textareaClass} md:col-span-2`}
            placeholder="Description"
          />
          <button type="submit" className={`${primaryButtonClass} md:col-span-2`}>
            Create Team
          </button>
        </form>
      </AdminCard>

      <AdminCard title="لیست تیم‌ها">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className={tableHeaderClass}>ID</th>
                <th className={tableHeaderClass}>Name</th>
                <th className={tableHeaderClass}>Founded</th>
                <th className={tableHeaderClass}>Sport / Location</th>
                <th className={tableHeaderClass}>Slug</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="border-b align-top">
                    <td className={tableCellClass}>{item.id}</td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <input
                          value={editFoundedYear}
                          onChange={(event) => setEditFoundedYear(event.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        String(toYearNumber(item.foundedYear))
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
                            <option value="">Select sport</option>
                            {sports.map((sport) => (
                              <option key={sport.id} value={String(sport.id)}>
                                {sport.id} - {sport.name}
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
                            value={editMemberIds}
                            onChange={(event) => setEditMemberIds(event.target.value)}
                            className={inputClass}
                            placeholder="Member IDs CSV (optional)"
                          />
                        </div>
                      ) : (
                        <>
                          <p>{item.sport?.name ?? "No sport"}</p>
                          <p className="text-xs text-gray-500">{item.location?.name ?? "No location"}</p>
                        </>
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            value={editSlug}
                            onChange={(event) => setEditSlug(event.target.value)}
                            className={inputClass}
                            placeholder="Slug"
                          />
                          <input
                            value={editIconUrl}
                            onChange={(event) => setEditIconUrl(event.target.value)}
                            className={inputClass}
                            placeholder="Icon URL"
                          />
                          <input
                            value={editWebsiteUrl}
                            onChange={(event) => setEditWebsiteUrl(event.target.value)}
                            className={inputClass}
                            placeholder="Website URL"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(event) => setEditDescription(event.target.value)}
                            className={textareaClass}
                            placeholder="Description"
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
