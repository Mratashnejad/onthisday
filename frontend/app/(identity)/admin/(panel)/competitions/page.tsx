"use client";

import { FormEvent, useState } from "react";
import {
  AdminCreateCompetitionDocument,
  AdminDeleteCompetitionDocument,
  AdminUpdateCompetitionDocument,
  CompetitionLevel,
} from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";
import { parseOptionalInt } from "@/components/admin/helpers";
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

export default function AdminCompetitionsPage() {
  const { dashboard, loading, error, message, runMutation, setError } =
    useAdminDashboard();

  const [name, setName] = useState("");
  const [sportId, setSportId] = useState("");
  const [level, setLevel] = useState<CompetitionLevel>(CompetitionLevel.International);
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSportId, setEditSportId] = useState("");
  const [editLevel, setEditLevel] = useState<CompetitionLevel>(CompetitionLevel.International);
  const [editShortName, setEditShortName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");

  const competitions = dashboard?.adminCompetitions ?? [];
  const sports = dashboard?.adminSports ?? [];

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSportId = parseOptionalInt(sportId);
    if (!parsedSportId) {
      setError("Sport id is required.");
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminCreateCompetitionDocument,
          {
            name,
            sportId: parsedSportId,
            level,
            shortName: shortName || null,
            slug: slug || null,
            description: description || null,
            logoUrl: logoUrl || null,
          },
          { accessToken },
        );

        setName("");
        setSportId("");
        setShortName("");
        setSlug("");
        setDescription("");
        setLogoUrl("");
      },
      "Competition created successfully.",
    );
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    const parsedSportId = parseOptionalInt(editSportId);
    if (!parsedSportId) {
      setError("Sport id is required for update.");
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminUpdateCompetitionDocument,
          {
            id: editingId,
            name: editName,
            sportId: parsedSportId,
            level: editLevel,
            shortName: editShortName || null,
            slug: editSlug || null,
            description: editDescription || null,
            logoUrl: editLogoUrl || null,
          },
          { accessToken },
        );

        setEditingId(null);
      },
      "Competition updated successfully.",
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this competition?")) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        const result = await executeGraphql(
          AdminDeleteCompetitionDocument,
          { id },
          { accessToken },
        );

        if (!result.deleteCompetition) {
          throw new Error("Competition was not found.");
        }
      },
      "Competition deleted successfully.",
    );
  }

  function startEdit(item: (typeof competitions)[number]) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditSportId(String(item.sportId));
    setEditLevel(item.level);
    setEditShortName(item.shortName ?? "");
    setEditSlug(item.slug);
    setEditDescription(item.description ?? "");
    setEditLogoUrl(item.logoUrl ?? "");
  }

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader title="مدیریت رقابت‌ها" description="CRUD کامل رقابت‌ها" />
      <AdminFeedback message={message} error={error} />

      <AdminCard title="ایجاد رقابت جدید">
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Name"
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
            value={level}
            onChange={(event) => setLevel(event.target.value as CompetitionLevel)}
            className={inputClass}
          >
            {Object.values(CompetitionLevel).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <input
            value={shortName}
            onChange={(event) => setShortName(event.target.value)}
            className={inputClass}
            placeholder="Short name"
          />
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={inputClass}
            placeholder="Slug"
          />
          <input
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            className={inputClass}
            placeholder="Logo URL"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${textareaClass} md:col-span-2`}
            placeholder="Description"
          />
          <button type="submit" className={`${primaryButtonClass} md:col-span-2`}>
            Create Competition
          </button>
        </form>
      </AdminCard>

      <AdminCard title="لیست رقابت‌ها">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className={tableHeaderClass}>ID</th>
                <th className={tableHeaderClass}>Name</th>
                <th className={tableHeaderClass}>Sport</th>
                <th className={tableHeaderClass}>Level</th>
                <th className={tableHeaderClass}>Slug</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="border-b align-top">
                    <td className={tableCellClass}>{item.id}</td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            className={inputClass}
                          />
                          <input
                            value={editShortName}
                            onChange={(event) => setEditShortName(event.target.value)}
                            className={inputClass}
                            placeholder="Short name"
                          />
                        </div>
                      ) : (
                        <>
                          <p>{item.name}</p>
                          <p className="text-xs text-gray-500">{item.shortName ?? "-"}</p>
                        </>
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
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
                      ) : (
                        item.sport?.name ?? "-"
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <select
                          value={editLevel}
                          onChange={(event) =>
                            setEditLevel(event.target.value as CompetitionLevel)
                          }
                          className={inputClass}
                        >
                          {Object.values(CompetitionLevel).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.level
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
                            value={editLogoUrl}
                            onChange={(event) => setEditLogoUrl(event.target.value)}
                            className={inputClass}
                            placeholder="Logo URL"
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
