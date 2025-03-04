package com.blossom.backend;

import com.blossom.common.base.BaseConstants;
import com.blossom.expand.tracker.core.Tracker;
import com.blossom.expand.tracker.core.common.TrackerConstants;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * BLOSSOM
 *
 * @author xzzz
 */
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class APP {

    public static void main(String[] args) {
        Tracker.start("APPLICATION_START", TrackerConstants.SPAN_TYPE_APPLICATION_RUN);
        SpringApplication.run(APP.class, args);
        BaseConstants.desc();
        Tracker.end();
    }

}
