import { addMessage, changeMessage, clear } from "./Events";
import axios, { AxiosInstance } from "axios";
import { chunk } from "lodash";
const insertMetadata = async (
  api: AxiosInstance,
  d2: any,
  endPoint: string[],
  additionalParam: any = {}
) => {
  const dhis2Api = d2.Api.getApi();
  let endPoints = {};
  endPoint.forEach((e: string) => {
    endPoints = { ...endPoints, [e]: true };
  });
  changeMessage(`Importing ${endPoint.join(",")}`);
  try {
    const { data } = await api.get("metadata.json", {
      params: { ...endPoints, ...additionalParam },
    });
    let { system, ...rest } = data;
    let { users, userGroups, visualizations, organisationUnits, options } =
      rest;
    if (users && userGroups) {
      const admin = users.find(
        (user: any) =>
          !!user.userCredentials && user.userCredentials.username === "admin"
      );
      const withoutCredentials = users
        .filter((s: any) => !s.userCredentials)
        .map((s: any) => s.id);
      users = users.filter(
        (user: any) =>
          !!user.userCredentials && user.userCredentials.username !== "admin"
      );
      userGroups = userGroups.map((ug: any) => {
        const gUsers = ug.users.filter(
          (u: any) => [...withoutCredentials, admin.id].indexOf(u.id) === -1
        );
        return { ...ug, users: gUsers };
      });
      rest = { ...rest, users, userGroups };
    }
    if (visualizations) {
      visualizations = visualizations.filter((v: any) => !!v.name && !!v.type);
      rest = { ...rest, visualizations };
    }
    if (options) {
      let c = 1;
      for (const opts of chunk(options, 1000)) {
        const { stats } = await dhis2Api.post("metadata", { options: opts });
        changeMessage(
          `Finished importing ${endPoint} chunk ${c} , Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`
        );
        addMessage(
          `Finished importing Options chunk ${c}, Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`
        );
        c = c + 1;
      }
    }

    if (organisationUnits) {
      let c = 1;
      for (const ous of chunk(organisationUnits, 500)) {
        const { stats } = await dhis2Api.post("metadata", {
          organisationUnits: ous,
        });
        changeMessage(
          `Finished importing ${endPoint} chunk ${c} , Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`
        );
        addMessage(
          `Finished importing organisations chunk ${c}, Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`
        );
        c = c + 1;
      }
    } else {
      const { stats } = await dhis2Api.post("metadata", rest);
      changeMessage(
        `Finished importing ${endPoint}, Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`
      );
      addMessage(
        `Finished importing ${endPoint}, Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`
      );
    }
  } catch (error) {
    changeMessage(`Failed to import ${endPoint} with error ${error.message}`);
    addMessage(`Failed to import ${endPoint} with error ${error.message}`);
  }
};

async function fetchAndInsertMetaData(data: any) {
  clear();
  const { d2, url, username, password } = data;
  const api = axios.create({
    baseURL: url,
    withCredentials: true,
    auth: {
      username,
      password,
    },
  });
  await insertMetadata(api, d2, ["userRoles"], {
    fields: ":owner,!lastUpdatedBy",
    filter: "name:neq:Superuser",
  });
  await insertMetadata(api, d2, ["users", "userGroups"], {
    fields:
      ":owner,!lastUpdatedBy,!organisationUnits,!dataViewOrganisationUnits,!teiSearchOrganisationUnits",
  });
  await insertMetadata(api, d2, ["organisationUnitLevels"], {
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["organisationUnits"], {
    filter: "level:eq:1",
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["organisationUnits"], {
    filter: "level:eq:2",
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["organisationUnits"], {
    filter: "level:eq:3",
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["organisationUnits"], {
    filter: "level:eq:4",
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["organisationUnits"], {
    filter: "level:eq:5",
    fields: ":owner",
  });
  await insertMetadata(
    api,
    d2,
    ["organisationUnitGroups", "organisationUnitGroupSets"],
    { fields: ":owner" }
  );
  await insertMetadata(
    api,
    d2,
    [
      "constants",
      "attributes",
      "categoryOptions",
      "categories",
      "categoryCombos",
      "categoryOptionCombos",
      "categoryOptionGroups",
      "categoryOptionGroupSets",
    ],
    { fields: ":owner" }
  );
  await insertMetadata(api, d2, ["options"], { fields: ":owner,!optionSet" });
  await insertMetadata(
    api,
    d2,
    ["optionSets", "optionGroups", "optionGroupSets"],
    { fields: ":owner" }
  );
  await insertMetadata(
    api,
    d2,
    ["legendSets", "dataElements", "dataElementGroups", "dataElementGroupSets"],
    { fields: ":owner" }
  );
  await insertMetadata(
    api,
    d2,
    ["trackedEntityAttributes", "trackedEntityTypes"],
    { fields: ":owner" }
  );
  await insertMetadata(
    api,
    d2,
    [
      "programNotificationTemplates",
      "programTrackedEntityAttributeGroups",
      "programStageSections",
      "programStages",
      "programs",
      "programSections",
      "programIndicators",
      "programIndicatorGroups",
      "dataEntryForms",
    ],
    { fields: ":owner" }
  );
  await insertMetadata(
    api,
    d2,
    [
      "programRules",
      "programRuleVariables",
      "programRuleActions",
      "relationshipTypes",
    ],
    { fields: ":owner" }
  );
  await insertMetadata(
    api,
    d2,
    ["indicatorTypes", "indicators", "indicatorGroups", "indicatorGroupSets"],
    { fields: ":owner" }
  );
  await insertMetadata(api, d2, ["maps", "mapViews", "externalLayers"], {
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["visualizations"], { fields: ":owner" });
  await insertMetadata(api, d2, [, "dataApprovalLevels"], { fields: ":owner" });
  await insertMetadata(api, d2, ["dataApprovalWorkflows"], {
    fields: ":owner",
  });
  await insertMetadata(api, d2, ["dataSets"], { fields: ":owner" });

  await insertMetadata(api, d2, ["users", "userGroups"], {
    fields: ":owner",
  });

  return "finished";
}

export { fetchAndInsertMetaData };
