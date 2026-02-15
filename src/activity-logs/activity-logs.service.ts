import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityLog } from "./entities/activity-log.entity";

export interface CreateActivityLogDto {
  action: string;
  url?: string;
  method?: string;
  userAgent?: string;
  statusCode?: string;
  ipAddress?: string;
  route?: string;
  result: "success" | "failure";
  responseTime?: string;
  user?: any;
  createdBy?: string;
}

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
  ) {}

  /**
   * Fire-and-forget logger
   * This should NEVER throw or block the request lifecycle
   */
  async log(data: CreateActivityLogDto): Promise<void> {
    try {
      const log = this.activityLogRepo.create({
        action: data.action,
        url: data.url,
        method: data.method,
        userAgent: data.userAgent,
        statusCode: data.statusCode,
        ipAddress: data.ipAddress,
        route: data.route,
        result: data.result,
        responseTime: data.responseTime,
        user: data.user || null,
        createdBy: data.createdBy || "system",
      });

      await this.activityLogRepo.save(log);
    } catch (error: any) {
      // Never crash the app because logging failed
      this.logger.error("Failed to save activity log", error?.stack || error);
    }
  }
}
