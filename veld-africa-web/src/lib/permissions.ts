import { prisma } from "./prisma"

// Check if user has access to a specific project
export async function hasProjectAccess(userId: string, projectId: string, minRole?: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  // Super admins have access to everything
  if (user?.role === "SUPER_ADMIN") return true

  const projectUser = await prisma.projectUser.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  })

  if (!projectUser) return false

  if (minRole) {
    const roleHierarchy: Record<string, number> = {
      ADMIN: 3,
      EDITOR: 2,
      VIEWER: 1,
    }
    return roleHierarchy[projectUser.role] >= roleHierarchy[minRole]
  }

  return true
}

// Get user's projects
export async function getUserProjects(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  // Super admin sees all projects
  if (user?.role === "SUPER_ADMIN") {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  // Others see only assigned projects
  const projectUsers = await prisma.projectUser.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  })

  return projectUsers.map((pu) => pu.project)
}

// Check permissions for actions
export const Permissions = {
  // Project actions
  PROJECT_CREATE: ["SUPER_ADMIN", "ADMIN"],
  PROJECT_UPDATE: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  PROJECT_DELETE: ["SUPER_ADMIN", "ADMIN"],
  PROJECT_PUBLISH: ["SUPER_ADMIN", "ADMIN"],

  // Property actions
  PROPERTY_CREATE: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  PROPERTY_UPDATE: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  PROPERTY_DELETE: ["SUPER_ADMIN", "ADMIN"],

  // Newsletter actions
  NEWSLETTER_CREATE: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  NEWSLETTER_UPDATE: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  NEWSLETTER_PUBLISH: ["SUPER_ADMIN", "ADMIN"],
  NEWSLETTER_SEND: ["SUPER_ADMIN", "ADMIN"],
  NEWSLETTER_DELETE: ["SUPER_ADMIN", "ADMIN"],

  // User actions
  USER_CREATE: ["SUPER_ADMIN", "ADMIN"],
  USER_UPDATE: ["SUPER_ADMIN", "ADMIN"],
  USER_DELETE: ["SUPER_ADMIN"],
  USER_ASSIGN_ROLE: ["SUPER_ADMIN", "ADMIN"],

  // Settings
  SETTINGS_UPDATE: ["SUPER_ADMIN", "ADMIN"],
  ANALYTICS_VIEW: ["SUPER_ADMIN", "ADMIN"],
}

export function hasPermission(userRole: string, permission: keyof typeof Permissions): boolean {
  return Permissions[permission].includes(userRole)
}

// Audit logging
export async function logAudit({
  userId,
  action,
  entity,
  entityId,
  oldData,
  newData,
  ipAddress,
  userAgent,
}: {
  userId?: string
  action: string
  entity: string
  entityId?: string
  oldData?: any
  newData?: any
  ipAddress?: string
  userAgent?: string
}) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      oldData,
      newData,
      ipAddress,
      userAgent,
    },
  })
}
