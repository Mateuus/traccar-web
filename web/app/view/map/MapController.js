/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.map.MapController', {
    extend: 'Traccar.view.map.MapMarkerController',
    alias: 'controller.map',

    requires: [
        'Traccar.GeofenceConverter'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    mapstaterequest: 'getMapState',
                    zoomtoalldevices: 'zoomToAllDevices'
                }
            },
            store: {
                '#Geofences': {
                    load: 'updateGeofences',
                    add: 'updateGeofences',
                    update: 'updateGeofences',
                    remove: 'updateGeofences'
                }
            }
        }
    },

    init: function () {
        this.callParent();
        this.lookupReference('showReportsButton').setVisible(
            Traccar.app.isMobile() && !Traccar.app.getBooleanAttributePreference('ui.disableReport'));
        this.lookupReference('showEventsButton').setVisible(
            Traccar.app.isMobile() && !Traccar.app.getBooleanAttributePreference('ui.disableEvents'));
    },

    showReports: function () {
        Traccar.app.showReports(true);
    },

    showEvents: function () {
        Traccar.app.showEvents(true);
    },

    onFollowClick: function (button, pressed) {
        if (pressed && this.selectedMarker) {
            this.getView().getMapView().setCenter(this.selectedMarker.getGeometry().getCoordinates());
        }
    },

    openStreetView:function(button,pressed){
        if (pressed && this.selectedMarker) {
           if(pressedDevice == null) {
               pressedDevice = this.selectedMarker.get('record').get('id');
           }
           var position = Ext.getStore('LatestPositions').findRecord('deviceId',pressedDevice,0,false,false,true);
           
           const panorama = new google.maps.StreetViewPanorama(
           document.getElementById("street-view"),
           {
             position: {
               lat: position.get('latitude'),
               lng: position.get('longitude')
             },
             pov: {
               heading: 34,
               pitch: 10,
             },
             visible: true,
             motionTracking: false,
             motionTrackingControl: false,
             linksControl: false,
             panControl: false,
             enableCloseButton: false
           }
         );
         document.getElementById('street-view').style.position = 'absolute';
         document.getElementById('street-view').style.right = '0px';
         document.getElementById('street-view').style.bottom = '0px';
         document.getElementById('street-view').style.cssFloat = 'right';
         document.getElementById('street-view').style.marginRight = '55px';
         document.getElementById('street-view').style.display = 'block';
         document.getElementById('street-view').style.marginBottom = '55px';
       }else{
           document.getElementById('street-view').style.display = 'none';
           pressedDevice = null;
           panorama = null;
       }
   },
    
    openSafeZone:function(button,pressed){
        var position, deviceId, deviceName, lat, long, safezoneRadius, circle, projection, feature, geofenceID, isSafezone = false;
        //Pegar variáveis do Device
        deviceId = this.selectedMarker.get('record').get('id');
        deviceName = this.selectedMarker.get('record').get('name');
        if (this.lookupReference('ShowsafezoneButton').pressed) {
            //Pegar posição do device do Device
            position = Ext.getStore('LatestPositions').findRecord('deviceId',this.selectedMarker.get('record').get('id'),0,false,false,true);
            lat = position.get('latitude');
            long = position.get("longitude");
            safezoneRadius = 30;
            projection = this.getView().getMapView();

            //Verificar se o Anti Furto Já está ligado.
            Ext.getStore('Geofences').each(function (geofence) {
                if(geofence.get('name') == deviceName) {
                    Traccar.app.showToast("Anti Furto já está Ligado!");
                    isSafezone = true;
                }
            }, this);

            //Criar Geofance
            circle = "CIRCLE ("+lat+" "+long+", "+safezoneRadius+")";
            var data = { "id": 0, "name": deviceName, "description": "AntiFurto", "area": circle, "calendarId": 0, "attributes": {"color":"#FF0000"} };

            //verificar se está ativa o não
            if(!isSafezone) {
                Ext.Ajax.request({
                    scope: this,
                    method: 'POST',
                    url: 'api/geofences',
                    jsonData: Ext.util.JSON.encode(data),
                    callback: function (options, success, response) {
                        if (!success) {
                            Traccar.app.showError(response);
                        }else{
                            geofenceID = JSON.parse(response.responseText);
                            var geodata = {"deviceId": deviceId, "geofenceId": geofenceID.id}
                            Ext.Ajax.request({
                                scope: this,
                                method: 'POST',
                                url: 'api/permissions',
                                jsonData: Ext.util.JSON.encode(geodata),
                                callback: function (options, success, response) {
                                    if (!success) {
                                        Traccar.app.showError(response);
                                    }else{
                                        Traccar.app.showToast("Anti Furto Ligado!");
                                        Ext.getStore('Geofences').load();
                                    }
                                }
                            });
                        }
                    }
                });
                //Criar um Circulo.
                feature = new ol.Feature(Traccar.GeofenceConverter.wktToGeometry(projection, circle));
                feature.setStyle(this.getAreaStyle(deviceName, null));
                this.getView().getGeofencesSource().addFeature(feature);
            }
        }else{
            //Deletar Anti Furto
            this.getView().getGeofencesSource().clear(); 
            Ext.getStore('Geofences').each(function (geofence) {
               if(deviceName == geofence.get('name')) {
                 var id = geofence.get('id');
                 Ext.Ajax.request({
                    scope: this,
                    method: 'DELETE',
                    url: 'api/geofences/'+id+'',
                    headers: { 'Content-Type': 'application/json' },
                    callback: function (options, success, response) {
                        if (!success) {
                            Traccar.app.showError(response);
                        }else{
                           Ext.getStore('Geofences').load();
                           Traccar.app.showToast("Anti Furto Desligado!");
                        }
                    }
                });
               }
            }, this);
        }
    },

    showLiveRoutes: function (button) {
        this.getView().getLiveRouteLayer().setVisible(button.pressed);
    },

    getMapState: function () {
        var zoom, center, projection;
        projection = this.getView().getMapView().getProjection();
        center = ol.proj.transform(this.getView().getMapView().getCenter(), projection, 'EPSG:4326');
        zoom = this.getView().getMapView().getZoom();
        this.fireEvent('mapstate', center[1], center[0], zoom);
    },

    updateGeofences: function () {
        this.getView().getGeofencesSource().clear();
        if (this.lookupReference('showGeofencesButton').pressed) {
            Ext.getStore('Geofences').each(function (geofence) {
                var feature = new ol.Feature(
                    Traccar.GeofenceConverter.wktToGeometry(this.getView().getMapView(), geofence.get('area')));
                feature.setStyle(this.getAreaStyle(
                    Ext.String.htmlDecode(geofence.get('name')),
                    geofence.get('attributes') ? geofence.get('attributes').color : null));
                this.getView().getGeofencesSource().addFeature(feature);
                return true;
            }, this);
        }
    },

    zoomToAllDevices: function () {
        this.zoomToAllPositions(Ext.getStore('LatestPositions').getData().items);
    }
});
