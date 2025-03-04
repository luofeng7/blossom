package com.blossom.backend.server.plan;

import com.blossom.backend.base.auth.AuthContext;
import com.blossom.backend.server.plan.pojo.*;
import com.blossom.common.base.pojo.R;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 计划
 *
 * @author xzzz
 */
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/plan")
public class PlanController {

    private final PlanService baseService;

    /**
     * 每日计划
     *
     * @param month 查询的月份, 会查询该月的所有每日计划
     */
    @GetMapping("/list/day")
    public R<Map<Date, List<PlanDayRes>>> days(String month) {
        return R.ok(baseService.listDay(month, AuthContext.getUserId()));
    }

    /**
     * 日常计划
     */
    @GetMapping("/list/daily")
    public R<List<PlanDailyRes>> daily() {
        return R.ok(baseService.listDaily(AuthContext.getUserId()));
    }

    /**
     * 新增每日计划
     */
    @PostMapping("/add/day")
    public R<?> day(@Validated @RequestBody PlanDayAddReq req) {
        req.setUserId(AuthContext.getUserId());
        baseService.addDay(req);
        return R.ok();
    }

    /**
     * 新增日常计划
     */
    @PostMapping("/add/daily")
    public R<?> daily(@Validated @RequestBody PlanDailyAddReq req) {
        req.setUserId(AuthContext.getUserId());
        baseService.addDaily(req);
        return R.ok();
    }

    /**
     * 删除计划
     */
    @PostMapping("/del")
    public R<?> del(@RequestBody PlanDelReq req) {
        baseService.del(req);
        return R.ok();
    }
}
