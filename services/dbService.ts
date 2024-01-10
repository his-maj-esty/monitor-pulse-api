import { PrismaClient } from "@prisma/client";
import { Website, timeStats } from "../typings";

export class dbService {
  static client: PrismaClient;

  constructor() {
    if (dbService.client) {
      return;
    }
    dbService.client = new PrismaClient();
  }

  async addWebsite({ name, url, email, userId }: Website): Promise<Website> {
    const res = await dbService.client.website.create({
      data: {
        name: name,
        url: url,
        email: email,
        userId: userId,
      },
    });
    return res;
  }

  async getWebsiteDetails({ id }: { id: string }) {
    const res = await dbService.client.website.findUnique({
      where: {
        id: id,
      },
      include: {
        stats: {
          select: {
            timestamp: true,
            ownerNotified: true,
            status: true,
          },
        },
      },
    });
    return res;
  }

  async getStats({
    name,
  }: {
    name: string;
  }): Promise<({ stats: timeStats[] } & Website)[]> {
    const res = await dbService.client.website.findMany({
      where: {
        name: name,
      },
      select: {
        id: true,
        name: true,
        url: true,
        email: true,
        userId: true,
        stats: {
          select: {
            status: true,
            timestamp: true,
            ownerNotified: true,
          },
        },
      },
    });
    return res;
  }

  async getWebsites({ userId }: { userId: string }): Promise<Website[]> {
    const res = await dbService.client.website.findMany({
      where: {
        userId: userId,
      },
    });
    return res;
  }

  async getWebsitesInDB(): Promise<Website[]> {
    const res = await dbService.client.website.findMany({
      where: {},
    });
    return res;
  }

  async deleteWebsite({ id }: { id: string }): Promise<Website> {
    const res = await dbService.client.website.delete({
      where: {
        id: id,
      },
    });
    return res;
  }

  async addStatus({
    name,
    status,
  }: {
    name: string;
    status: number;
  }): Promise<Website> {
    const res = await dbService.client.website.update({
      where: {
        name: name,
      },
      data: {
        stats: {
          create: {
            status: status,
          },
        },
      },
    });
    return res;
  }

  async optOutForNotification({ id }: { id: string }): Promise<Website> {
    const res = await dbService.client.website.update({
      where: {
        id: id,
      },
      data: {
        optedForNotification: false,
      },
    });
    return res;
  }

  async optInForNotification({ id }: { id: string }): Promise<Website> {
    const res = await dbService.client.website.update({
      where: {
        id: id,
      },
      data: {
        optedForNotification: true,
      },
    });
    return res;
  }

  async isSubscribed({ id }: { id: string }) {
    const res = await dbService.client.website.findFirst({
      where: {
        id: id,
      },
    });

    if (res?.optedForNotification) {
      return true;
    } else {
      return false;
    }
  }

  async getNotifications({ id }: { id: string }) {
    const res = await dbService.client.website.findUnique({
      where: {
        id: id,
      },
      include: {
        notifications: {
          select: {
            type: true,
            sentAt: true,
            downtimeAt: true,
          },
        },
      },
    });

    return res;
  }

  async getStatsWithPendingNotification() {
    const res = await dbService.client.website.findMany({
      where: {
        optedForNotification: true,
        stats: {
          some: {
            ownerNotified: false,
            status: 0,
          },
        },
      },
      include: {
        stats: {
          select: {
            id: true,
            timestamp: true,
            ownerNotified: true,
            status: true,
          },
        },
      },
    });
    console.log("pending response: ", res);
    return res;
  }

  async setStatusNotified({ statusId }: { statusId: number }) {
    const res = await dbService.client.stats.update({
      where: {
        id: statusId,
      },
      data: {
        ownerNotified: true,
      },
    });
    return res;
  }

  async addNotification({
    id,
    type,
    timestamps,
  }: {
    id: string;
    type: string;
    timestamps: string;
  }) {
    const res = await dbService.client.website.update({
      where: {
        id: id,
      },
      data: {
        notifications: {
          create: {
            type: type,
            downtimeAt: timestamps,
          },
        },
      },
    });
  }
}
