/*
 * Copyright 2016 - 2021 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.map.BaseMap', {
    extend: 'Ext.panel.Panel',
    xtype: 'baseMapView',

    layout: 'fit',

    getMap: function () {
        return this.map;
    },

    getMapView: function () {
        return this.mapView;
    },

    initMap: function () {
        var server, layer, type, bingKey, lat, lon, zoom, maxZoom, target, poiLayer, self = this;

        server = Traccar.app.getServer();

        type = Traccar.app.getPreference('map', null);
        bingKey = server.get('bingKey');

        /*
        layer = new ol.layer.Group({
            title: Strings.mapLayer,
            layers: [
                new ol.layer.Tile({
                    title: Strings.mapCustom,
                    type: 'base',
                    visible: type === 'custom',
                    source: new ol.source.XYZ({
                        url: Ext.String.htmlDecode(server.get('mapUrl')),
                        attributions: ''
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapCustomArcgis,
                    type: 'base',
                    visible: type === 'customArcgis',
                    source: new ol.source.TileArcGISRest({
                        url: Ext.String.htmlDecode(server.get('mapUrl'))
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapBingRoad,
                    type: 'base',
                    visible: type === 'bingRoad',
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'Road'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapBingAerial,
                    type: 'base',
                    visible: type === 'bingAerial',
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'Aerial'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapBingHybrid,
                    type: 'base',
                    visible: type === 'bingHybrid',
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'AerialWithLabels'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapCarto,
                    type: 'base',
                    visible: type === 'carto',
                    source: new ol.source.XYZ({
                        url: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                            'contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapAutoNavi,
                    type: 'base',
                    visible: type === 'autoNavi' || type === 'baidu',
                    source: new ol.source.OSM({
                        url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapYandexMap,
                    type: 'base',
                    visible: type === 'yandexMap',
                    source: new ol.source.XYZ({
                        url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        attributions: '&copy; <a href="https://yandex.com/maps/">Yandex</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapYandexSat,
                    type: 'base',
                    visible: type === 'yandexSat',
                    source: new ol.source.XYZ({
                        url: 'https://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        attributions: '&copy; <a href="https://yandex.com/maps/">Yandex</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapWikimedia,
                    type: 'base',
                    visible: type === 'wikimedia',
                    source: new ol.source.OSM({
                        url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
                    })
                }),
                new ol.layer.Tile({
                    title: Strings.mapOsm,
                    type: 'base',
                    visible: type === 'osm' || !type,
                    source: new ol.source.OSM({})
                })
            ]
        });*/

        layer = [
			new ol.layer.Tile({
				title:"Mapa Custom",
				type:"base",
				visible: "custom" == type?!0:!1,
                   source: new ol.source.XYZ({
                       url: Ext.String.htmlDecode(server.get('mapUrl')),
                       attributions: ''
                   })
            }),
				new ol.layer.Tile({
					title:"Mapa Custom (Arcgis)",
					type:"base",
					visible: "customArcgis" == type?!0:!1,
                    source: new ol.source.XYZ({
                        url: Ext.String.htmlDecode(server.get('mapUrl')),
                        attributions: ''
                    })
                }),
				new ol.layer.Tile({
					title:"Mapa Carto",
					type:"base",
					visible: "carto" == type?!0:!1,
                    source: new ol.source.XYZ({
                        url: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                            'contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    })
                }),
				new ol.layer.Tile(
				{
					title:"Mapa Google H\u00edbrido",
					type:"base",
					visible: "googleH" == type?!0:!1,
					source:new ol.source.XYZ({
						url:"http://mt0.google.com/vt/lyrs\x3dy\x26hl\x3den\x26x\x3d{x}\x26y\x3d{y}\x26z\x3d{z}\x26s\x3dGa"
					})
				}),
				new ol.layer.Tile(
				{
					title:"Mapa Google Sat\u00e9lite",
					type:"base",
					visible: "googleSA" == type?!0:!1,
					source:new ol.source.XYZ({
						url:"https://mt0.google.com/vt/lyrs\x3ds\x26hl\x3den\x26x\x3d{x}\x26y\x3d{y}\x26z\x3d{z}\x26s\x3dGa"
						})
				}),
				new ol.layer.Tile(
				{
					title:"Mapa Google Tr\u00e2nsito",
					type:"base",
					visible: "googleT" == type?!0:!1,
					source:new ol.source.XYZ({
						url:"https://mt0.google.com/vt/lyrs\x3dm,traffic\x26hl\x3den\x26x\x3d{x}\x26y\x3d{y}\x26z\x3d{z}\x26s\x3dGa"
						})
				}),
				new ol.layer.Tile(
				{
					title:"Mapa Google Road",
					type:"base",
					visible: "googleR" == type?!0:!1,
					source:new ol.source.XYZ({
						url:"https://mt0.google.com/vt/lyrs\x3dm\x26hl\x3den\x26x\x3d{x}\x26y\x3d{y}\x26z\x3d{z}\x26s\x3dGa"
					})
				}
			)];

        lat = Traccar.app.getPreference('latitude', Traccar.Style.mapDefaultLat);
        lon = Traccar.app.getPreference('longitude', Traccar.Style.mapDefaultLon);
        zoom = Traccar.app.getPreference('zoom', Traccar.Style.mapDefaultZoom);
        maxZoom = Traccar.app.getAttributePreference('web.maxZoom', Traccar.Style.mapMaxZoom);

        this.mapView = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom,
            maxZoom: maxZoom
        });

        this.map = new ol.Map({
            target: this.body.dom.id,
            //layers: [layer],
            layers: layer,
            view: this.mapView
        });

        poiLayer = Traccar.app.getPreference('poiLayer', null);

        if (poiLayer) {
            this.map.addLayer(new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: poiLayer,
                    format: new ol.format.KML()
                })
            }));
        }

        this.body.dom.tabIndex = 0;

        switch (Traccar.app.getAttributePreference('distanceUnit', 'km')) {
            case 'mi':
                this.map.addControl(new ol.control.ScaleLine({
                    units: 'us'
                }));
                break;
            case 'nmi':
                this.map.addControl(new ol.control.ScaleLine({
                    units: 'nautical'
                }));
                break;
            default:
                this.map.addControl(new ol.control.ScaleLine());
                break;
        }

        this.map.addControl(new ol.control.LayerSwitcher());


        this.map.addControl(new ol.control.FullScreen({className: 'ol-full-screen', tipLabel: 'Toggle full-screen'}));


        /*********************************************************************************************/
		/**Mapa Online Informações.**/
		var logoimg = document.createElement("img");
		logoimg.id = "logam";
		logoimg.src = "themes/default/logo/logo-interno.png";
		
		var myElementLogo = document.createElement("div");
		myElementLogo.className = "ol-zoom ol-unselectable ol-logo-int";
		myElementLogo.appendChild(logoimg);
		
		var NewLogo = new ol.control.Control({element: myElementLogo});
		this.map.addControl(NewLogo);
		
		
		var dOnline = document.createElement("button");
		dOnline.id = "dOnline";
		dOnline.style = "background-color:rgba(99, 233, 149, 0.7)!important;color:rgb(0, 0, 0)!important;width:40px!important;border-radius:10%!important;";
		dOnline.setAttribute("data-toggle","popover");
		dOnline.setAttribute("data-trigger","hover");
		dOnline.setAttribute("data-content","ve\u00edculo online");
				
		var dOffline = document.createElement("button");
		dOffline.id = "dOffline";
		dOffline.style = "background-color:rgba(241, 192, 202, 0.7)!important;color:rgb(0, 0, 0)!important;width:40px!important;border-radius:10%!important;";
		dOffline.setAttribute("data-toggle","popover");
		dOffline.setAttribute("data-trigger","hover");
		dOffline.setAttribute("data-content","ve\u00edculo offline");
		
		
		var dMovimento = document.createElement("button");
		dMovimento.id = "dVM";
		dMovimento.style = "background-color:rgba(144, 179, 241, 0.7)!important;color:rgb(0, 0, 0)!important;width:40px!important;border-radius:10%!important;";
		dMovimento.setAttribute("data-toggle","popover");
		dMovimento.setAttribute("data-trigger","hover");
		dMovimento.setAttribute("data-content","ve\u00edculo em movimento");
		
		var dTotal = document.createElement("button");
		dTotal.id = "dTotal";
		dTotal.style = "background-color:rgba(244, 253, 138)!important;color:rgb(0, 0, 0)!important;width:40px!important;border-radius:10%!important;";
		dTotal.setAttribute("data-toggle","popover");
		dTotal.setAttribute("data-trigger","hover");
		dTotal.setAttribute("data-content","Total de ve\u00edculos");
		
		
		var myElement = document.createElement("div");
		myElement.className	= "rotate-north ol-unselectable ol-control";
		myElement.appendChild(dOnline);
		myElement.appendChild(dOffline);
		myElement.appendChild(dMovimento);
		myElement.appendChild(dTotal);

		
		var NewControl = new ol.control.Control({element: myElement});
		this.map.addControl(NewControl);

        /*********************************************************************************************/
		/** INICIO MENU **/		
		
		var sharedGeofences = document.createElement("button");//ok
		sharedGeofences.className = "cerca";
		sharedGeofences.setAttribute("data-toggle","popover");
		sharedGeofences.setAttribute("data-trigger","hover");
		sharedGeofences.setAttribute("data-content",Strings.sharedGeofences);
		sharedGeofences.innerHTML = '\x3ci class\x3d"fa fa-dot-circle-o" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		sharedGeofences.onclick = function(){document.getElementById("geofencesIdd").click()};
		
		var mapLiveRoutes = document.createElement("button");//ok
		mapLiveRoutes.className = "avv";
		mapLiveRoutes.setAttribute("data-toggle","popover");
		mapLiveRoutes.setAttribute("data-trigger","hover");
		mapLiveRoutes.setAttribute("data-content",Strings.mapLiveRoutes);
		mapLiveRoutes.innerHTML = '\x3ci class\x3d"fa fa-paw" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		mapLiveRoutes.onclick = function(){document.getElementById("routesIdd").click()};
		
		var deviceFollow = document.createElement("button");//ok
		deviceFollow.className = "segg";
		deviceFollow.setAttribute("data-toggle","popover");
		deviceFollow.setAttribute("data-trigger","hover");
		deviceFollow.setAttribute("data-content",Strings.deviceFollow);
		deviceFollow.innerHTML = '\x3ci class\x3d"fa fa-crosshairs" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		deviceFollow.onclick = function(){document.getElementById("followIdd").click()};
		
		var reportTitle = document.createElement("button");
		reportTitle.className = "report-text";
		reportTitle.setAttribute("data-toggle","popover");
		reportTitle.setAttribute("data-trigger","hover");
		reportTitle.setAttribute("data-content",Strings.reportTitle);
		reportTitle.innerHTML = '\x3ci class\x3d"fa fa-file-text-o" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		reportTitle.onclick = function(){
				Ext.create('Traccar.view.BaseWindow', {
					title: Strings.reportTitle,
					items: {
						xtype: 'reportView'
					}
				}).show();
		};
		
		var reportEvents = document.createElement("button");
		reportEvents.className = "bell";
		reportEvents.setAttribute("data-toggle","popover");
		reportEvents.setAttribute("data-trigger","hover");
		reportEvents.setAttribute("data-content",Strings.reportEvents);
		reportEvents.innerHTML = '\x3ci class\x3d"fa fa-bell-o" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		reportEvents.onclick = function(){
				Ext.create('Traccar.view.BaseWindow', {
					items: {
						xtype: 'eventsView'
					}
				}).show();
		};
		
		var streetView = document.createElement("button");
		streetView.className = "road";
		streetView.setAttribute("data-toggle","popover");
		streetView.setAttribute("data-trigger","hover");
		streetView.setAttribute("data-content","Street-View");
		streetView.innerHTML = '\x3ci class\x3d"fa fa-road" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		streetView.onclick = function(){document.getElementById("streetvv").click()};
		
		var suporteWhats = document.createElement("button");
		suporteWhats.className = "was";
		suporteWhats.setAttribute("data-toggle","popover");
		suporteWhats.setAttribute("data-trigger","hover");
		suporteWhats.setAttribute("data-content","Whatsapp");
		suporteWhats.innerHTML = '\x3ci class\x3d"fa fa-whatsapp" aria-hidden\x3d"true"\x3e\x3c/i\x3e';
		suporteWhats.onclick = function(){
			$.getJSON('themes/default/info.json', function(data) {
				window.open('https://web.whatsapp.com/send?phone='+data.whatsapp_suport+'&text='+data.whatsapp_suport_text+'', '_blank');
			});
		};
		
		
		var DivMenuBtns = document.createElement("div");
		DivMenuBtns.className="ol-unselectable ol-control menu-btns";
		DivMenuBtns.appendChild(sharedGeofences);
		DivMenuBtns.appendChild(mapLiveRoutes);
		DivMenuBtns.appendChild(deviceFollow);
		DivMenuBtns.appendChild(reportTitle);
		DivMenuBtns.appendChild(reportEvents);
		DivMenuBtns.appendChild(streetView);
		DivMenuBtns.appendChild(suporteWhats);
		
		var NewMenu = new ol.control.Control({element: DivMenuBtns});
		this.map.addControl(NewMenu);
		
		/*********************************************************************************************/

        target = this.map.getTarget();
        if (typeof target === 'string') {
            target = Ext.get(target).dom;
        }

        this.map.on('pointermove', function (e) {
            var hit = this.forEachFeatureAtPixel(e.pixel, function () {
                return true;
            });
            if (hit) {
                target.style.cursor = 'pointer';
            } else {
                target.style.cursor = '';
            }
        });

        var container = document.getElementById("popup");
		var content = document.getElementById("popup-content");
		var closer = document.getElementById("popup-closer");
		var commandsButtons = document.getElementById("commands-buttons");

        /**
		* Create an overlay to anchor the popup to the map.
		*/
		var overlay = new ol.Overlay({
			element: container,
			autoPan: true,
			autoPanAnimation: {
				duration: 250,
			},
		});
		/**
		* Add a click handler to hide the popup.
		* @return {boolean} Don't follow the href.
		*/
		closer.onclick = function () {
			overlay.setPosition(undefined);
			closer.blur();
			return false;
		};
        /*
        this.map.on('click', function (e) {
            var i, features = self.map.getFeaturesAtPixel(e.pixel, {
                layerFilter: function (layer) {
                    return !layer.get('name');
                }
            });
            if (features) {
                for (i = 0; i < features.length; i++) {
                    self.fireEvent('selectfeature', features[i]);
                }
            } else {
                self.fireEvent('deselectfeature');
            }
        });*/

        this.map.on('click', function (e) {
            var coordinate = e.coordinate;
           
           var i, features = self.map.getFeaturesAtPixel(e.pixel, {
               layerFilter: function (layer) {
                   return !layer.get('name');
               }
           });

           if(features) {
                //Fechar se tiver aberto
                overlay.setPosition(undefined);
                self.fireEvent('deselectfeature');

               for (i = 0; i < features.length; i++) {
                   self.fireEvent('selectfeature', features[i]);
                   var record = features[i].get("record");
                   
                   if (record instanceof Traccar.model.Device) {
                       var element = overlay.getElement();
                       self.map.addOverlay(overlay);
                       //Traccar.app.showOverlay(self.map,record,coordinate,overlay);
                       var deviceID = Ext.getStore('Devices').getById(record.get('id'));
                       var position = Ext.getStore('LatestPositions').findRecord('deviceId',record.get('id'),0,false,false,true);
                       var attributes = position.get("attributes");
                       var ignition =  attributes.ignition?Strings.eventIgnitionOn:Strings.eventIgnitionOff;
                       var motion = attributes.motion?'Sim':'N\u00e3o';
                       var odometer = attributes.totalDistance+" km"
                       var deviceStatus = Strings.deviceStatusUnknown;
                       switch (deviceID.get('status')) {
                           case 'online':
                               deviceStatus = Strings.deviceStatusOnline;
                               break;
                           case 'offline':
                               deviceStatus = Strings.deviceStatusOffline;
                               break;
                           default:
                           deviceStatus = Strings.deviceStatusUnknown;
                       }
                       
                       var foto = '';
                                               
                       if(deviceID.get('photo') != "") {
                           foto = 'data:image/gif;base64,'+deviceID.get('photo')+'';
                       }else{
                           foto = '/conf/img/default.png';
                       }
                       
                       content.innerHTML = '<div class="container">'+
                       '<div class="row row-name text-center">'+
                       '<div class="col-12"><h5><code>'+deviceID.get('name')+'</code></h5></div>'+
                       '</div>'+
                       '<div class="row row-popup">'+
                       '<div class="col-md-6 col-sm-6 col-6 text-center">'+
                       '<button type="button" id="info" class="btn btn-success">INFORMAÇÕES</button>'+
                       '</div>'+
                       '<div class="col-md-6 col-sm-6 col-6 text-center"> '+
                       '<button type="button" id="foto" class="btn btn-info">FOTO</button>'+
                       '</div>'+
                       '</div>'+
                       '<div id = "divinfo" class="row row-p" style="display: block;">'+
                       '<div class="col-12" style="padding-left:0px!important;">'+
                       '<p>Placa : <code>DLA-6F69</code></p><p>Estado : <code>'+deviceStatus+'</code></p><p>Movimento : <code>'+motion+'</code></p><p>Ignição : <code>'+ignition+'</code></p><p>Velocidade : <code>'+Traccar.AttributeFormatter.getFormatter('speed')(position.get('speed'))+'</code></p><p>Odômetro : <code>'+odometer+' </code></p><p>Data : <code>'+Traccar.AttributeFormatter.getFormatter('fixTime')(position.get('fixTime'))+'</code></p><p>Endereço : <code>'+position.get('address')+'</code></p>'+
                       '</div>'+
                       '</div>'+
                       '<div id = "divfoto" class="row row-imagem" style="display: none; margin-top: 15px;">'+
                       '<div class="col-12 text-center">'+
                       '<img class="img-fluid" src="'+foto+'">'+
                       '</div>'+
                       '</div>'+
                       '</div>';
                       /*
                       content.innerHTML = '<img class="img-car" src="'+foto+'">'+
                       '<div class="nome">'+deviceID.get('name')+'</div>'+
                       '<div class="title"><p>'+Strings.positionIgnition+' : <code>'+ignition+'</code></p></div>'+
                       '<div class="title"><p>'+Strings.positionMotion+' : <code>'+motion+'</code></p></div>'+
                       '<div class="title"><p>'+Strings.commandData+' : <code>'+Traccar.AttributeFormatter.getFormatter('fixTime')(position.get('fixTime'))+'</code></p></div>'+
                       '<div class="title"><p>'+Strings.deviceStatus+' : <code>'+deviceStatus+'</code></p></div>'+
                       '<div class="title"><p>'+Strings.positionSpeed+' : <code>'+Traccar.AttributeFormatter.getFormatter('speed')(position.get('speed'))+'</code></p></div>'+
                       '<div class="title"><p>'+Strings.positionAddress+' : <code>'+position.get('address')+'</code></p></div>'+
                       '</div>';
                       */
                       
                       
                   
                       element.style.display	= 'block';
                       overlay.setPosition(coordinate);
                       
                       document.getElementById('info').onclick = function(){
                           document.getElementById("divinfo").style.display = 'block';
                           document.getElementById("divfoto").style.display = 'none';
                       }
                       
                       document.getElementById('foto').onclick = function(){
                           document.getElementById("divinfo").style.display = 'none';
                           document.getElementById("divfoto").style.display = 'block';
                       }
                       
                       document.getElementById('bloqueio').onclick = function(){
                               swal({
                                       title: 'Bloquear?',
                                       text: 'Deseja realmente bloquear o ve\u00edculo',
                                       type: 'warning',
                                       showCancelButton: true,
                                       confirmButtonClass: 'btn-danger',
                                       confirmButtonText: 'Sim',
                                       cancelButtonText: 'Cancelar',
                                       closeOnConfirm: true
                                   },function(){
                                       var commands = {
                                           deviceId: record.get('id'),
                                           type:'engineStop'
                                       };
                                       Ext.Ajax.request({
                                           url: 'api/commands/send',
                                           jsonData: Ext.encode(commands),
                                       success: function (response) {
                                            Traccar.app.showToast(response.status === 202 ? Strings.commandQueued : Strings.commandSent);
                                       },
                                       failure: function (response) {}
                                       })	
                                   }
                               )};
                               
                               
                       document.getElementById('desbloqueio').onclick = function(){
                               swal({
                                   title:'Desbloquear?',
                                   text:'Deseja desbloquear o ve\u00edculo',
                                   type: 'info',
                                   showCancelButton:true,
                                   confirmButtonClass: 'btn-success',
                                   confirmButtonText: 'Sim',
                                   cancelButtonText: 'Cancelar',
                                   closeOnConfirm: true
                                   },function(){
                                       var commands = {
                                           deviceId: record.get('id'),
                                           type: 'engineResume'
                                       };
                                       Ext.Ajax.request({
                                           url: 'api/commands/send',
                                           jsonData: Ext.encode(commands),
                                           success:function(response){
                                                Traccar.app.showToast(response.status === 202 ? Strings.commandQueued : Strings.commandSent);
                                           },
                                           failure:function(response){}})
                                   })
                       };
                       
                       document.getElementById('localStret').onclick=function(){document.getElementById('streetvv').click()};
                       
                       document.getElementById('local').onclick = function(){
                               window.open('https://www.google.com/maps/place/'+position.get('latitude')+','+position.get("longitude")+'/@'+position.get('latitude')+','+position.get('longitude')+',17z/data\x3d!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d'+position.get('latitude')+'!4d'+position.get('longitude')+',_blank');
                       };

                      document.getElementById('localSafezone').onclick=function(){document.getElementById('safezoneIdd').click()};
                   }
               }
           }	
       });
       
       $('[data-toggle="popover"]').popover();
    },

    listeners: {
        afterrender: function () {
            this.initMap();
        },

        resize: function () {
            this.map.updateSize();
        }
    }
}, function () {
    var projection;
    proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
    ol.proj.proj4.register(proj4);
    projection = ol.proj.get('EPSG:3395');
    if (projection) {
        projection.setExtent([-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]);
    }
});
