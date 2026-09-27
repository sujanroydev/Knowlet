"use server";

import {
  getResourcesByPathPrefix as _getResourcesByPathPrefix,
  getResourceCounts as _getResourceCounts,
  insertResource as _insertResource,
} from "@/db/resource";

import { getSubjectId, insertSubject } from "@/db/resource/subject";
import { getPaperId, insertPaper } from "@/db/resource/paper";
import { getLevelId, insertLevel } from "@/db/resource/level";

import { getAuthenticatedUserId } from "@/lib/auth/getAuthenticatedUserId";
import { NewResource } from "@/types/resource";
import { buildResourcePath, parseResourcePath } from "@/utils/resource";
import sortByPath from "@/utils/sortByPath";

export async function getNearByResources(path: string) {
  const pathPrefix = path.replace(/\d+$/, "");
  return await _getResourcesByPathPrefix(pathPrefix).then(sortByPath);
}

export async function getResourceCounts(resourceId: string) {
  return await _getResourceCounts(resourceId);
}

export async function insertResource(newResource: NewResource) {
  await getAuthenticatedUserId();
  return _insertResource(newResource);
}

export async function ensureResourceHierarchy({
  level,
  subject,
  paper,
  target,
  type,
}: {
  level: string;
  subject: string;
  paper: string | undefined;
  target: string;
  type: string;
}) {
  const path = buildResourcePath({ level, subject, paper, target, type });

  const { levelSlug, subjectSlug, paperSlug } = parseResourcePath(path);

  let levelId = (await getLevelId(levelSlug)) as string | undefined;
  let subjectId: string;
  let paperId: string | undefined;
  let isSubjectNew = false;

  if (!levelId) {
    const levelData = await insertLevel({
      title: level,
      number: Number(levelSlug.split("-")[1]),
      slug: levelSlug,
      path: levelSlug,
    });

    levelId = levelData.id;

    const subjectData = await insertSubject({
      level_id: levelId,
      title: subject,
      slug: subjectSlug,
      path: `${levelSlug}/${subjectSlug}`,
    });

    subjectId = subjectData.id;
    isSubjectNew = true;
  } else {
    subjectId = await getSubjectId(subjectSlug, levelId);

    if (!subjectId) {
      const subjectData = await insertSubject({
        level_id: levelId,
        title: subject,
        slug: subjectSlug,
        path: `${levelSlug}/${subjectSlug}`,
      });

      subjectId = subjectData.id;
      isSubjectNew = true;
    }
  }

  if (paperSlug) {
    if (!isSubjectNew) {
      paperId = await getPaperId(paperSlug, subjectId);
    }
    if (!paperId) {
      const paperData = await insertPaper({
        subject_id: subjectId,
        level_id: levelId,
        title: paperSlug.split("-").join(" ").toUpperCase(),
        code: paperSlug.split("-").join("").toUpperCase(),
        slug: paperSlug,
        path: `${levelSlug}/${subjectSlug}/${paperSlug}`,
      });

      paperId = paperData.id;
    }
  }

  return { levelId, subjectId, paperId };
}
