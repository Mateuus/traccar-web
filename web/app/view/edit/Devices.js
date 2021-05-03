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

Ext.define('Traccar.view.edit.Devices', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'devicesView',

    requires: [
        'Traccar.AttributeFormatter',
        'Traccar.view.edit.DevicesController',
        'Traccar.view.ArrayListFilter',
        'Traccar.view.DeviceMenu'
    ],

    controller: 'devices',

    store: 'VisibleDevices',

    stateful: true,
    stateId: 'devices-grid',

    tbar: {
        componentCls: 'toolbar-header-style',
        defaults: {
            xtype: 'button',
            disabled: true,
            tooltipType: 'title'
        },
        items: [{
            xtype: 'tbtext',
            html: Strings.deviceTitle,
            baseCls: 'x-panel-header-title-default'
        }, {
            xtype: 'tbfill',
            disabled: false
        }, {
            handler: 'onAddClick',
            reference: 'toolbarAddButton',
            glyph: 'xf067@FontAwesome',
            tooltip: Strings.sharedAdd
        }, {
            handler: 'onEditClick',
            reference: 'toolbarEditButton',
            glyph: 'xf040@FontAwesome',
            tooltip: Strings.sharedEdit
        }, {
            handler: 'onRemoveClick',
            reference: 'toolbarRemoveButton',
            glyph: 'xf00d@FontAwesome',
            tooltip: Strings.sharedRemove
        }, {
            handler: 'onCommandClick',
            reference: 'deviceCommandButton',
            glyph: 'xf093@FontAwesome',
            tooltip: Strings.deviceCommand
        }, {
            xtype: 'deviceMenu',
            reference: 'toolbarDeviceMenu',
            enableToggle: false
        }]
    },

	bbar: {
        componentCls: 'toolbar-header-style',
        defaults: {
			xtype: 'tbtext',
			html: Strings.sharedSearch,
            baseCls: 'x-panel-header-title-default'
        },
        items: [{
			xtype: 'tbtext',
			html: Strings.sharedSearch,
			},{
			xtype: 'textfield',
			flex: 1, 
			listeners: {
				change: function () {
					this.up('grid').store.clearFilter();
					var regex = RegExp(this.getValue(), 'i');				

					this.up('grid').store.filter(new Ext.util.Filter({
						filterFn: function (object) {
							var match = false;
							Ext.Object.each(object.data, function (property, value) {
								match = match ||  regex.test(String(value));
							});
							return match;
						  }
					}));
				}
			}
		}]
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    viewConfig: {
        enableTextSelection: true,
        getRowClass: function (record) {
            var result = '', status = record.get('status');
            if (record.get('disabled')) {
                result = 'view-item-disabled ';
            }
            if (status) {
                result += Ext.getStore('DeviceStatuses').getById(status).get('color');
            }
            return result;
        }
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.sharedName,
            dataIndex: 'name',
            filter: 'string'
        }, {
            text: Strings.devicePlaca,
            dataIndex: 'placaId',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.deviceIdentifier,
            dataIndex: 'uniqueId',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.sharedPhone,
            dataIndex: 'phone',
            hidden: true
        }, {
            text: Strings.deviceModel,
            dataIndex: 'model',
            hidden: true
        }, {
            text: Strings.deviceTrackerModel,
            dataIndex: 'trackermodel',
            hidden: true
        }, {
            text: Strings.deviceComplement,
            dataIndex: 'complement',
            hidden: true
        }, {
            text: Strings.deviceContact,
            dataIndex: 'contact',
            hidden: true
        }, {
            text: Strings.groupDialog,
            dataIndex: 'groupId',
            hidden: true,
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'Groups'
            },
            renderer: Traccar.AttributeFormatter.getFormatter('groupId')
        }, {
            text: Strings.sharedDisabled,
            dataIndex: 'disabled',
            renderer: Traccar.AttributeFormatter.getFormatter('disabled'),
            hidden: true,
            filter: 'boolean'
        }, {
            text: Strings.sharedExpired,
            dataIndex: 'expired',
            renderer: Traccar.AttributeFormatter.getFormatter('expired'),
            hidden: true,
            filter: 'boolean'
        }, {
            text: Strings.sharedGeofences,
            dataIndex: 'geofenceIds',
            hidden: true,
            filter: {
                type: 'arraylist',
                idField: 'id',
                labelField: 'name',
                store: 'Geofences'
            },
            renderer: function (value) {
                var i, name, result = '';
                if (Ext.isArray(value)) {
                    for (i = 0; i < value.length; i++) {
                        name = Traccar.AttributeFormatter.geofenceIdFormatter(value[i]);
                        if (name) {
                            result += name + (i < value.length - 1 ? ', ' : '');
                        }
                    }
                }
                return result;
            }
        }, {
            text: Strings.deviceStatus,
            dataIndex: 'status',
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'DeviceStatuses'
            },
            renderer: function (value) {
                var status;
                if (value) {
                    status = Ext.getStore('DeviceStatuses').getById(value);
                    if (status) {
                        return status.get('name');
                    }
                }
                return null;
            }
        }, {
            text: Strings.deviceLastUpdate,
            dataIndex: 'lastUpdate',
            renderer: Traccar.AttributeFormatter.getFormatter('lastUpdate')
        }, 	{
			text: Strings.positionSpeed,
			dataIndex: 'attributes',
			renderer: function (value, metaData, device) {
				var position;
				return position = (position = Ext.getStore('LatestPositions').findRecord('deviceId',device.get('id'),0,false,false,true))?Math.floor(position.data.speed)+" km/h":"0 km/h"				
            }
		}, 	{
			text: "Status",
			dataIndex: 'attributes',
			renderer: function (value, metaData, device) {
				var statusDevice;
				var ignition = '<i class="fa fa-key" style="color:#A9A9A9" title="Nenhum Status de ignição"></i>'
				var motion = '<i class="fas fa-stop" style="margin-left:5px;color:#A9A9A9" title="Veiculo parado"></i>';
				var block = '<i class="fas fa-lock-open" style="margin-left:5px;position:relative;top:-1px;color:#A9A9A9" title="Nenhum Status de Bloqueio"></i>';
				var power = '<i class="fas fa-exclamation-triangle" style="margin-left:5px;color:#A9A9A9" title="Nenhum Alerta"></i>';
				
				if (statusDevice = (statusDevice = Ext.getStore('LatestPositions').findRecord('deviceId',device.get('id'),0,false,false,true))) 
				{	
					if(statusDevice.data.attributes.ignition == 1)  {
						ignition = '<i class="fa fa-key" style="color:#00a82d" title="Ignição Ligada"></i>';
					} else if(statusDevice.data.attributes.ignition == 0)  {
						ignition = '<i class="fa fa-key" style="color:#ea0707" title="Ignição desligada"></i>';
					}
            
					if(statusDevice.data.attributes.motion == 1)  {
						if(statusDevice.data.speed >= 1) {
							motion = '<i class="fas fa-angle-double-right" style="margin-left:5px;color:blue; text-shadow: 0 0 4px #000;" title="Veículo em movimento"></i>';
						}
					}

                    if(statusDevice.data.attributes.blocked == 1)  {
						block = '<i class="fas fa-lock" style="margin-left:5px;position:relative;top:-1px;color:#d60b0b; text-shadow: 0 0 4px #000;" title="Bloqueado"></i>';
					} else if(statusDevice.data.attributes.blocked == 0)  {
						block = '<i class="fas fa-lock-open" style="margin-left:5px;position:relative;top:-1px;color:#00a82d" title="Desbloqueado"></i>';
					}

                    if(statusDevice.data.attributes.alarm == "powerOff")  {
						power = '<i class="fas fa-exclamation-triangle" style="margin-left:5px;color:#d60b0b; text-shadow: 0 0 4px #000;" title="powerOff" id="ext-element-107"></i>';
					}
                    
					return ignition+motion+block+power
				} return ignition+motion+block+power
			}
		}]
    }
});
