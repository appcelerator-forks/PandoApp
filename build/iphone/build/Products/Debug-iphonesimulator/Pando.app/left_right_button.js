function event_touch(obj) {
    obj.addEventListener("touchstart", function(e) {
        current_point = {
            x: e.x,
            y: e.y
        };
    });
    obj.addEventListener("touchmove", function(e) {
        var floatpoint = (e.x - current_point.x) / 100;
        if (e.x - current_point.x < 0) {
            yes_no = -.5 > floatpoint ? "yes" : "";
            $.left_button_indicator.setOpacity(-floatpoint);
        } else {
            floatpoint > .5 && (yes_no = "no");
            $.right_button_indicator.setOpacity(floatpoint);
        }
    });
    obj.addEventListener("touchend", function() {
        var d = new Date();
        var now = Math.floor(d.getTime() / 1e3);
        if ("yes" == yes_no) {
            lives -= 1;
            Ti.App.Properties.setString("lives", lives);
            $.lives_bar.image = lives_bar[lives];
            estimate_time = now > estimate_time ? parseInt(now) + waiting_time : parseInt(estimate_time) + waiting_time;
            Ti.App.Properties.setString("estimate_time", estimate_time);
            timer(1);
            animation("left", this);
            sound_yes.play();
            refreshLife();
            item.insetItem();
        } else if ("no" == yes_no) {
            animation("right", this);
            sound_no.play();
            item.insetItem();
        } else {
            $.left_button_indicator.setOpacity(0);
            $.right_button_indicator.setOpacity(0);
        }
        yes_no = "";
    });
}