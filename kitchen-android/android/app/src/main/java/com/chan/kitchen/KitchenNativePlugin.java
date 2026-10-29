package com.chan.kitchen;
import android.view.WindowManager;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
@CapacitorPlugin(name = "KitchenNative")
public class KitchenNativePlugin extends Plugin {
  @PluginMethod public void keepAwake(PluginCall call) {
    boolean enabled = call.getBoolean("enabled", false);
    getActivity().runOnUiThread(() -> {
      if(enabled) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      call.resolve();
    });
  }
}
